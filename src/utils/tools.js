/**
 * 获取浏览器名称
 * @return {string}
 */
export function getBrowserName() {
  let browserName = '';
  try {
    // 判断浏览器名字
    const Sys = {};
    const ua = navigator.userAgent.toLowerCase();
    let s; (s = ua.match(/msie/)) ? Sys.msie = s[0]
      : (s = ua.match(/trident/)) ? Sys.trident = s[0]
        : (s = ua.match(/edge/)) ? Sys.chrome = s[0]
          : (s = ua.match(/firefox/)) ? Sys.firefox = s[0]
            : (s = ua.match(/360/)) ? Sys.chrome = s[0]
              : (s = ua.match(/metasr/)) ? Sys.chrome = s[0]
                : (s = ua.match(/ubrowser/)) ? Sys.chrome = s[0]
                  : (s = ua.match(/qqbrowser/)) ? Sys.chrome = s[0]
                    : (s = ua.match(/chrome/)) ? Sys.chrome = s[0]
                      : (s = ua.match(/safari/)) ? Sys.safari = s[0] : 0;

    if (!s) {
      s = ['otherBrowser'];
    }
    s[0] == 'trident' ? s[0] = 'Internet Explorer'
      : s[0] == 'msie' ? s[0] = 'Internet Explorer'
        : s[0] == 'edge' ? s[0] = 'Microsoft Edge'
          : s[0] == 'metasr' ? s[0] = 'metasr'
            : s[0] == 'chrome' ? s[0] = 'Chrome'
              : s[0] == 'firefox' ? s[0] = 'Firefox'
                : s[0] == 'safari' ? s[0] = 'Safari'
                  : s[0] == 'ubrowser' ? s[0] = 'Uc' : '';
    browserName = s[0]
  } catch (e) {
    console.log('browserName', e);
  }

  return browserName
}