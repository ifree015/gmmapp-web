class PromiseNativeCaller {
  constructor() {
    this.promises = {};
  }

  // generates a unique id, not obligator a UUID
  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // eslint-disable-next-line eqeqeq
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

    return uuid;
  }

  postMessage(messageName, data) {
    return new Promise((resolve) => {
      let newPromiseId = this.generateUUID();
      let nativeData = {
        guid: newPromiseId,
        data: data,
      };
      window.webkit.messageHandlers[messageName].postMessage(nativeData);
      this.promises[newPromiseId] = (data) => {
        resolve(data);
      };
    });
  }

  executePromise(guid, data) {
    var promiseFunction = this.promises[guid];
    if (promiseFunction) {
      promiseFunction.call(null, data);
    }

    delete this.promises[guid];
  }
}

if (!window.promiseNativeCaller) {
  window.promiseNativeCaller = new PromiseNativeCaller();
}

export default window.promiseNativeCaller;
