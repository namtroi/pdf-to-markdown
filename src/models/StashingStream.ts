// Abstract stream which allows stash items temporarily
export abstract class StashingStream<TIn, TOut = TIn> {
  protected results: TOut[] = [];
  protected stash: TIn[] = [];

  constructor() {
    if (new.target === StashingStream) {
      throw new TypeError('Can not construct abstract class.');
    }
  }

  consumeAll(items: TIn[]): void {
    items.forEach((item) => this.consume(item));
  }

  consume(item: TIn): void {
    if (this.shouldStash(item)) {
      if (!this.matchesStash(item)) {
        this.flushStash();
      }
      this.pushOnStash(item);
    } else {
      if (this.stash.length > 0) {
        this.flushStash();
      }
      this.handleNonStashed(item);
    }
  }

  protected pushOnStash(item: TIn): void {
    this.onPushOnStash(item);
    this.stash.push(item);
  }

  complete(): TOut[] {
    if (this.stash.length > 0) {
      this.flushStash();
    }
    return this.results;
  }

  // return true if the item matches the items of the stack
  private matchesStash(item: TIn): boolean {
    if (this.stash.length === 0) {
      return true;
    }
    const lastItem = this.stash[this.stash.length - 1]!;
    return this.doMatchesStash(lastItem, item);
  }

  private flushStash(): void {
    if (this.stash.length > 0) {
      this.doFlushStash(this.stash, this.results);
      this.stash = [];
    }
  }

  protected onPushOnStash(_item: TIn): void {
    // sub-classes may override
  }

  // Handle non-stashed items. Default behavior: push directly (works for same-type streams).
  // Transforming streams (TIn !== TOut) must override if non-stashed items need transformation.
  protected handleNonStashed(item: TIn): void {
    // Default: push item directly (only works when TIn === TOut)
    // Subclasses with different TIn/TOut must override this method
    this.results.push(item as unknown as TOut);
  }

  protected abstract shouldStash(item: TIn): boolean;

  protected abstract doMatchesStash(lastItem: TIn, item: TIn): boolean;

  protected abstract doFlushStash(stash: TIn[], results: TOut[]): void;
}
