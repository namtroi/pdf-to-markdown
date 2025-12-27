// Abstract stream which allows stash items temporarily
export abstract class StashingStream<T> {
  protected results: T[] = [];
  protected stash: T[] = [];

  constructor() {
    if (new.target === StashingStream) {
      throw new TypeError('Can not construct abstract class.');
    }
  }

  consumeAll(items: T[]): void {
    items.forEach((item) => this.consume(item));
  }

  consume(item: T): void {
    if (this.shouldStash(item)) {
      if (!this.matchesStash(item)) {
        this.flushStash();
      }
      this.pushOnStash(item);
    } else {
      if (this.stash.length > 0) {
        this.flushStash();
      }
      this.results.push(item);
    }
  }

  protected pushOnStash(item: T): void {
    this.onPushOnStash(item);
    this.stash.push(item);
  }

  complete(): T[] {
    if (this.stash.length > 0) {
      this.flushStash();
    }
    return this.results;
  }

  // return true if the item matches the items of the stack
  private matchesStash(item: T): boolean {
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

  protected onPushOnStash(_item: T): void {
    // sub-classes may override
  }

  protected abstract shouldStash(item: T): boolean;

  protected abstract doMatchesStash(lastItem: T, item: T): boolean;

  protected abstract doFlushStash(stash: T[], results: T[]): void;
}
