import promiseNativeCaller from '@common/utils/promiseNativeCaller';

class NativeApp {
  static isAndroid() {
    return !!window.android;
  }

  static isIOS() {
    return !!window.webkit?.messageHandlers;
  }

  isNativeApp() {
    return NativeApp.isAndroid() || NativeApp.isIOS();
  }

  getWebView() {
    return this.isNativeApp() ? (NativeApp.isAndroid() ? window.android : window.webkit) : null;
  }

  isAsync() {
    return NativeApp.isIOS();
  }
}

class AndroidApp extends NativeApp {
  showWebView() {
    return;
    //this.getWebView()?.showWebView();
  }

  loggedIn(loginInfo) {
    return;
  }

  getAppName() {
    return this.getWebView()?.getAppName();
  }

  getAppInfo() {
    return JSON.parse(this.getWebView()?.getAppInfo() ?? null);
  }

  isPermission(infoType) {
    return this.getWebView()?.isPermission(infoType);
  }

  getLastKnownLocation() {
    return JSON.parse(this.getWebView()?.getLastKnownLocation() ?? null);
  }

  setThemeMode(mode) {
    this.getWebView()?.setThemeMode(mode);
  }

  showToastMessage(message) {
    this.getWebView()?.showToastMessage(message);
  }
}

class IOSApp extends NativeApp {
  showWebView() {
    //if (!this.getWebView()) return;
    this.getWebView().messageHandlers.showWebView.postMessage({
      guid: promiseNativeCaller.generateUUID(),
    });
  }

  loggedIn(loginInfo) {
    this.getWebView().messageHandlers.loggedIn.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: loginInfo,
    });
  }

  async getAppName() {
    return promiseNativeCaller.postMessage('getAppName');
  }

  async getAppInfo() {
    return JSON.parse((await promiseNativeCaller.postMessage('getAppInfo')) ?? null);
  }

  async isPermission(infoType) {
    return Boolean(await promiseNativeCaller.postMessage('isPermission', infoType));
  }

  async getLastKnownLocation() {
    return JSON.parse((await promiseNativeCaller.postMessage('getLastKnownLocation')) ?? null);
  }

  setThemeMode(mode) {
    this.getWebView().messageHandlers.setThemeMode.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: mode,
    });
  }

  showToastMessage(message) {
    this.getWebView().messageHandlers.showToastMessage.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: message,
    });
  }
}

const nativeApp = NativeApp.isIOS() ? new IOSApp() : new AndroidApp();

export default nativeApp;
