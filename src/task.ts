export interface TaskConfigFn { (data: object) : void };

export class TaskConfig {

  public TASK : string;
  public opts: object = {};

  apply(fnOrObj?  : TaskConfigFn | object) {
    if (!fnOrObj) return;

    if (typeof fnOrObj === "object") {
      this.applyOptions(fnOrObj);
      return;
    }
    this.applyFunction(fnOrObj);
  }

  applyFunction(fn: TaskConfigFn) {
    fn(this);
  }

  applyOptions(opts: object) {
    this.opts = Object.assign(this.opts, opts);
  }

}
