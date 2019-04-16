export class Device {
  width: number;
  height: number;
  name: string;

  constructor(width: number, height: number, name: string) {
    this.width = width;
    this.height = height;
    this.name = name;
  }
}

export const templates = {
  iphoneXMax: new Device(414, 896, 'iPhone XR/XS Max'),
  iphoneX: new Device(375, 812, 'iPhone X/XS'),
  iphonePlus: new Device(414, 736, 'iPhone 6/7/8 Plus'),
  iphone: new Device(375, 667, 'iPhone 6/7/8'),
  iphoneSE: new Device(320, 568, 'iPhone 5/SE'),
  ipad: new Device(768, 1024, 'iPad'),
  ipadPro10: new Device(834, 1112, 'iPad Pro 10.5inch'),
  ipadPro11: new Device(834, 1194, 'iPad Pro 11inch'),
  ipadPro12: new Device(1024, 1366, 'iPad Pro 12.9inch'),
  watch38: new Device(136, 170, 'Watch 38mm'),
  watch40: new Device(162, 197, 'Watch 40mm'),
  watch42: new Device(156, 195, 'Watch 42mm'),
  watch44: new Device(184, 224, 'Watch 44mm'),
  android: new Device(360, 640, 'Android Mobile'),
  androidTablet: new Device(768, 1024, 'Android Tablet'),
  androidWear: new Device(280, 280, 'Android Wear'),
  surface3: new Device(1440, 960, 'Surface Pro 3'),
  surface: new Device(1368, 912, 'Surface Pro 4/5/6'),
  web1280: new Device(1280, 800, 'Web 1280px'),
  web1366: new Device(1366, 768, 'Web 1366px'),
  web1920: new Device(1920, 1080, 'Web 1920px'),
};
