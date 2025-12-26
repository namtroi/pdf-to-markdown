// Abstract stream which allows stash items temporarily
export abstract class StashingStream {
  protected results: any[] = [];
  protected stash: any[] = [];

  constructor() {
    if (new.target === StashingStream) {
      throw new TypeError('Can not construct abstract class.');
    }
  }

  consumeAll(items: any[]): void {
    items.forEach((item) => this.consume(item));
  }

  consume(item: any): void {
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

  protected pushOnStash(item: any): void {
    this.onPushOnStash(item);
    this.stash.push(item);
  }

  complete(): any[] {
    if (this.stash.length > 0) {
      this.flushStash();
    }
    return this.results;
  }

  // return true if the item matches the items of the stack
  private matchesStash(item: any): boolean {
    if (this.stash.length === 0) {
      return true;
    }
    const lastItem = this.stash[this.stash.length - 1];
    return this.doMatchesStash(lastItem, item);
  }

  private flushStash(): void {
    if (this.stash.length > 0) {
      this.doFlushStash(this.stash, this.results);
      this.stash = [];
    }
  }

  protected onPushOnStash(_item: any): void {
    // sub-classes may override
  }

  protected abstract shouldStash(item: any): boolean;

  protected abstract doMatchesStash(lastItem: any, item: any): boolean;

  protected abstract doFlushStash(stash: any[], results: any[]): void;
}
