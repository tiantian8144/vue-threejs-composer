import { AssetType } from "./AssetTypes";
import { EventDispatcher } from "./EventDispatcher";
import { Handle } from "./Handle";

interface AssetPair {
  name: string;
  value: Promise<AssetType>;
}
type AssetMap = Map<string, Promise<AssetType>>;
type SearchAssetMap = Map<BundleHandle, AssetMap>;

export class BundleHandle extends Handle {
  private _assets: AssetMap = new Map();
  private _dependencies: BundleHandle[] = [];
  private _registered = this.queue;

  private _preload: boolean = false;

  private _onLoadProgress = new EventDispatcher<
    (amount: number, total: number, name: string) => Promise<void>
  >();

  public get onLoadProgress() {
    return this._onLoadProgress;
  }
  public get preload() {
    return this.preload;
  }
  public set preload(val: boolean) {
    this._preload = val;
  }

  /**
   * Register asset
   * @param bundles
   */
  public registerAsset(pName: string, pAsset: Promise<AssetType>) {
    this._assets.set(pName, pAsset);
  }
  /**
   * Unregister asset
   * @param bundles
   */
  public unregisterAsset(pName: string) {
    this._assets.delete(pName);
  }

  /**
   * Register dependency
   * @param bundle
   */
  public registerDependency(bundle: BundleHandle) {
    this._dependencies.push(bundle);
    bundle.use();
    // we don't need to wait until it is completely loaded
    // only until all assets are registered
    return bundle._registered;
  }

  /**
   * Register multiple dependencies
   * @param bundles
   */
  public registerDependencies(bundles: BundleHandle[]) {
    const p = bundles.map(bundle => this.registerDependency(bundle));
    return Promise.all(p);
  }

  /**
   * Count total number of assets across all given bundle and all their dependencies
   * @param bundles
   */
  public static countAssets(bundles: BundleHandle[]): number {
    const countMap = new Map<BundleHandle, number>();
    bundles.forEach(bundle => this.recursiveCountAssets(countMap, bundle));

    let total = 0;
    countMap.forEach(amount => {
      total += amount;
    });
    return total;
  }
  /**
   * Count total number of assets across this bundle and all dependencies
   */
  public countAssets() {
    return BundleHandle.countAssets([this]);
  }

  /**
   * List of all assets across all given bundles and all their dependencies
   * @param bundles
   */
  public static listAssets(bundles: BundleHandle[]): AssetPair[] {
    const map: SearchAssetMap = new Map();
    bundles.forEach(bundle => this.recursiveListAssets(map, bundle));

    const arr: AssetPair[] = [];
    map.forEach(assetMap => {
      assetMap.forEach((value, name) => {
        arr.push({
          name,
          value
        });
      });
    });
    return arr;
  }
  /**
   * List of all assets across this bundle and all dependencies
   */
  public listAssets() {
    return BundleHandle.listAssets([this]);
  }

  protected load() {
    this._registered = super.load();
    return this._registered
      .then(() => {
        // go to next tick to allow user code to execute first before ready
        return new Promise(r => setTimeout(r, 0));
      })
      .then(() => {
        return this.awaitAllAssets();
      });
  }

  protected unload() {
    return super
      .unload()
      .then(() => {
        const deps = this._dependencies.map(dep => dep.unuse());
        return Promise.all(deps).then(() => Promise.resolve());
      })
      .then(() => {
        this._dependencies = [];
        this._assets.clear();
        return Promise.resolve();
      });
  }

  private awaitAllAssets(): Promise<void> {
    const allAssets = this.listAssets();
    const total = allAssets.length;
    let count = 0;

    const pAssets = allAssets.map(asset => {
      return asset.value.then(() => {
        ++count;
        const progress = this._onLoadProgress.listeners.map(fn =>
          fn(count, total, name)
        );
        return Promise.all(progress);
      });
    });

    return Promise.all(pAssets).then(() => Promise.resolve());
  }

  private static recursiveCountAssets(
    map: Map<BundleHandle, number>,
    pBundle: BundleHandle
  ) {
    if (!map.has(pBundle)) {
      map.set(pBundle, pBundle._assets.size);
    }
    pBundle._dependencies.forEach(bundle => {
      this.recursiveCountAssets(map, bundle);
    });
  }

  private static recursiveListAssets(
    map: SearchAssetMap,
    pBundle: BundleHandle
  ) {
    if (!map.has(pBundle)) {
      map.set(pBundle, pBundle._assets);
    }
    pBundle._dependencies.forEach(bundle => {
      this.recursiveListAssets(map, bundle);
    });
  }
}
