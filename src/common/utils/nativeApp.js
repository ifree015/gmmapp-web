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

  isAndroid() {
    return NativeApp.isAndroid();
  }

  isIOS() {
    return NativeApp.isIOS();
  }

  getWebView() {
    return this.isNativeApp() ? (NativeApp.isAndroid() ? window.android : window.webkit) : null;
  }

  isAsync() {
    return NativeApp.isIOS();
  }
}

class AndroidApp extends NativeApp {
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

  showToastMessage(message) {
    this.getWebView()?.showToastMessage(message);
  }

  loginView(from, viewInfo) {
    // todo
  }

  loggedIn(loginInfo) {
    // todo
  }

  setThemeMode(mode) {
    this.getWebView()?.setThemeMode(mode);
  }

  // updatePushNtfcNcnt(pushNtfcNcnt) {
  //   // todo
  // }

  navigateView(location, viewInfo) {
    // todo
  }

  modalView(location, viewInfo) {
    // todo
  }

  pushView(location, viewInfo) {
    // todo
  }

  setViewInfo(viewInfo) {
    // todo
  }

  goBack() {
    // todo
  }

  loggedOut() {
    // todo
  }
}

class IOSApp extends NativeApp {
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

  showToastMessage(message) {
    this.getWebView().messageHandlers.showToastMessage.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: message,
    });
  }

  loginView(from, viewInfo) {
    this.getWebView().messageHandlers.loginView.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: { from, viewInfo },
    });
  }

  loggedIn(loginInfo) {
    this.getWebView().messageHandlers.loggedIn.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: loginInfo,
    });
  }

  setThemeMode(mode) {
    this.getWebView().messageHandlers.setThemeMode.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: mode,
    });
  }

  // updatePushNtfcNcnt(pushNtfcNcnt) {
  //   this.getWebView().messageHandlers.updatePushNtfcNcnt.postMessage({
  //     guid: promiseNativeCaller.generateUUID(),
  //     data: pushNtfcNcnt,
  //   });
  // }

  navigateView(location, viewInfo) {
    this.getWebView().messageHandlers.navigateView.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: { location, viewInfo },
    });
  }

  modalView(location, viewInfo) {
    this.getWebView().messageHandlers.modalView.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: { location, viewInfo },
    });
  }

  pushView(location, viewInfo) {
    this.getWebView().messageHandlers.pushView.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: { location, viewInfo },
    });
  }

  setViewInfo(viewInfo) {
    this.getWebView().messageHandlers.setViewInfo.postMessage({
      guid: promiseNativeCaller.generateUUID(),
      data: viewInfo,
    });
  }

  goBack() {
    this.getWebView().messageHandlers.goBack.postMessage({
      guid: promiseNativeCaller.generateUUID(),
    });
  }

  loggedOut() {
    this.getWebView().messageHandlers.loggedOut.postMessage({
      guid: promiseNativeCaller.generateUUID(),
    });
  }
}

const nativeApp = NativeApp.isIOS() ? new IOSApp() : new AndroidApp();

export { nativeApp as default, NativeApp };
