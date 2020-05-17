function loadImgs() {
  var imgs = document.getElementsByTagName("img");
  for (var i = 0; i < imgs.length; i++) {
    if (imgs[i].getAttribute("docsrc")) {
      if (!imgs[i].getAttribute("src")) {
        imgs[i].setAttribute("src", imgs[i].getAttribute("docsrc"));
      }
    }
  }
}

function ltrim(s) {
  return s.replace(/^\s*/, "");
}

function rtrim(s) {
  return s.replace(/\s*$/, "");
}

function trim(s) {
  return rtrim(ltrim(s));
}

function goBackTop() {
  var oBackTopBtn = jQuery(".goBackTop");
  if (!oBackTopBtn) {
    return;
  }
  jQuery(window).on("scroll", function () {
    var st = jQuery(this).scrollTop();
    var sw = window.innerHeight;
    if (oBackTopBtn) {
      if (st > 10) {
        oBackTopBtn.css("visibility", "visible");
        oBackTopBtn.click(function (e) {
          e.stopPropagation();
          hideURLbar();
        });
      } else {
        oBackTopBtn.css("visibility", "hidden");
      }
    }
  });
}

//search delete
function delSearchContent() {
  var oInput = document.getElementById("search"),
      oCross = document.getElementById("cross");
  if (!oInput || !oCross) {
    return;
  }

  function check() {
    if (oInput.value != "") {
      oCross.style.display = "block";
      //jQuery('.search-box-new .search-btn').show();
    } else {
      oCross.style.display = "none";
      //jQuery('.search-box-new .search-btn').hide();
    }
  }

  check();
  oInput.oninput = check;
  oCross.onclick = function () {
    oInput.value = "";
    this.style.display = "none";
    oInput.focus();
    //jQuery('.search-box-new .search-btn').hide();
  };
}

//打开搜索框
function openSearch() {
  var openBtn = jQuery("#openSearch"),
      oSerachArea = jQuery("#searchBox"),
      oSearchInput = jQuery("#search");
  if (openBtn.length > 0 && oSerachArea.length > 0) {
    openBtn.bind("click", function () {
      if (oSerachArea.hasClass('sl')) {
        oSerachArea.hide().removeClass('sl');
      } else {
        oSerachArea.show().addClass('sl');
        oSearchInput.focus();
      }
    });
    delSearchContent();
  }
}

//隐藏地址栏
function hideURLbar() {
  setTimeout(scrollTo, 100, 0, 1);
}

function touch_back() {
  window.history.back();
}

function check() {
  if (jQuery("#search").length <= 0) {
    return;
  }
  var rkey = jQuery("#search").val().trim();
  if (rkey == "" || rkey.length == 0) {
    return false;
  }
  return true;
}

function LoadJS(url, type, callback) {
  var script = document.createElement("script")
  script.type = "text/javascript";
  if (script.readyState) { //IE
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        if (callback) {
          callback();
        }
      }
    };
  } else { //Others
    script.onload = function () {
      if (callback) {
        callback();
      }
    };
  }
  if (!!type) {
    script.charset = "gbk";
  }
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

//LoadJS(picture_image_path_v1 + "/js/clipboard.min.js", 1); //加载剪切板
function kDefaultFocus() {
  var d = document,
      k = d.getElementById('search');
  if (!k) {
    return false;
  }
  var ikey = k.value;
  k.value = "";
  k.focus();
  k.value = ikey;
  if ((typeof isBuild) != "undefined") {
    if (isBuild && jQuery('.selectBuildCata').length > 0) {
      jQuery('.selectBuildCata').attr('disabled', true);
    }
  }
};

function copyToClipboard(btnClass, str) {
  var clipboard = new ClipboardJS(btnClass, {
    text: function () {
      return str;
    }
  });
  clipboard.on('success', function (e) {
    console.log("copy success!");
    clipboard = null;
  });
  clipboard.on('error', function (e) {
    console.log("copy error!");
    clipboard = null;
  });
}

var touchFun = {
  touchFunInit: function () {
    var _this = this;
    _this.miniScreen = window.screen.height > 480 ? true : false;
    _this.initSearch(); //初始化搜索
    _this.openChannel(); //打开频道导航
    _this.backStep(); //返回上一步
  },
  backStep: function () {
    var _this = this;
    var oBackBtn = jQuery(".m-header-top-end .header-back .ico_btn_back");
    if (oBackBtn.length > 0) {
      oBackBtn.bind("click", function () {
        touch_back();
      });
    }
  },
  initSearch: function () {
    var _this = this;
    var oDefaultSearch = jQuery(".search-box-new .search-box-inner");
    var oDefaultCross = oDefaultSearch.find(".cross");
    if (oDefaultSearch.length > 0) {
      oDefaultSearch.bind("click", function (event) {
        if (event.target.tagName.toLowerCase() == "i") {
          _this.createSearchPage(1);
        } else {
          _this.createSearchPage(); //打开搜索page
        }
        inputForbidTab();
        return false;
      });
    }
    var searchClick = typeof (rechargeConfig) != "undefined" ? 6607 : 6612;

    var oEndHeaderSearch = jQuery(".m-header-top .toolbar_search");
    if (oEndHeaderSearch.length > 0) {
      var oBlackSearch = oEndHeaderSearch.find(".ico_btn_black_search");
      if (oBlackSearch.length == 0) {
        oEndHeaderSearch.bind("click", function () {
          _this.createSearchPage();
        });
      } else {
        oEndHeaderSearch.bind("click", function () {
          if (jQuery(".seach-nov").length > 0) {
            if (jQuery(".seach-nov").is(':visible')) {
              jQuery(".seach-nov").hide();
            } else {
              jQuery(".seach-nov").show();
              if (jQuery('.ico_more_btn').hasClass("ico_more_up")) {
                jQuery(".toolbar_more").click();
              }

            }
          }
        });
      }
    }
    if (jQuery("#searchBox").length > 0) {
      delSearchContent();
    }

  },
  bindMethod: function () {
    var oHistoryRemove = jQuery(".header-search-history .ico_btn_remove"),
        oHistoryDelete = jQuery(".header-search-history .ico_btn_delete");
    if (oHistoryRemove.length > 0) {
      oHistoryRemove.bind("click", function () {
        jQuery(this).parent().addClass("delete-item");
        jQuery(this).parent().remove();
        if (jQuery('#search_history li').length == 0) {
          jQuery('.header-search-history').remove();
        }
      })
    }
    if (oHistoryDelete.length > 0) {
      oHistoryDelete.bind("click", function () {
        jQuery(this).parent().parent().remove();
      })
    }
  },
  openChannel: function () {
    var oShowNavlistBtn = jQuery(".toolbar_more"),

        oToolHeadTop = jQuery(".m-header-top");
    if (jQuery(".header_nav_list").length > 0) {
      jQuery(".header_nav_list").css("height", 0);
    }
    if (oShowNavlistBtn.length > 0 && oToolHeadTop.length > 0) {
      jQuery(".m-header-top .header_nav_list").addClass("headerBg");
      var oNavListHeight = "75px"; //100

      var oHeaderHeight = "114px"; //173
      jQuery(".header_nav_list").css("height", 0);
      var headerBarHeight = jQuery(".m-header-top").height();
      jQuery("body").css({
        'paddingTop': headerBarHeight + 'px'
      });
      oShowNavlistBtn.bind("click", function () {
        if (jQuery(this).find('span').hasClass("ico_more_up")) {
          jQuery(this).find('span').removeClass("ico_more_up");
          jQuery("body").css({
            'paddingTop': headerBarHeight,
            'webkitTransition': 'all .3s',
          });
          jQuery(".header_nav_list").css({
            //"visibility":'hidden',
            'opacity': '0',
            "height": '0'
          });
          // 适应医疗
          if (jQuery(".header_nav_list").hasClass('header_nav_list_others')) {
            if (jQuery('.menu').length >= 1) {
              jQuery('.menu').removeClass('menu-down-cur');
            }
            if (jQuery('.menu-detail').length >= 1) {
              jQuery('.menu-detail').removeClass('menu-detail-cur');
            }
            if (jQuery('.search-menu').length >= 1) {
              jQuery('.search-menu').removeClass('search-menu-cur');
            }
          }
          if (typeof (playerConf) != "undefined" && !jQuery("#wrap").hasClass("minpic")) {
            var tempHeight = jQuery(window).height() - jQuery(".m-header-top header").height() - 60;
            jQuery("#wrap").css({
              "height": tempHeight
            });
          }
        } else {
          jQuery(this).find('span').addClass("ico_more_up");
          jQuery(".header_nav_list").css({
            'opacity': '1',
            "height": oNavListHeight
          });
          jQuery("body").css({
            'paddingTop': oHeaderHeight,
            'webkitTransition': 'all .3s'
          });
          // 适应医疗
          if (jQuery(".header_nav_list").hasClass('header_nav_list_others')) {
            // 查疾病 查药品页
            if (jQuery('.menu').length >= 1) {
              jQuery('.menu').addClass('menu-down-cur');
            }
            if (jQuery('.menu-detail').length >= 1) {
              jQuery('.menu-detail').addClass('menu-detail-cur');
            }
            // 搜索结果页
            if (jQuery('.search-menu').length >= 1) {
              jQuery('.search-menu').addClass('search-menu-cur');
            }
          }
          //alert(oHeaderHeight);
          if (typeof (playerConf) != "undefined" && !jQuery("#wrap").hasClass("minpic")) {
            var tempHeight = jQuery(window).height() - oHeaderHeight - 60;
            jQuery("#wrap").css({
              "height": tempHeight
            });
          }
          //点击搜索 导航隐藏
          if (jQuery(".m-header-top-end .ico_btn_black_search").length > 0 && jQuery("#searchBox").is(":visible")) {
            jQuery("#searchBox").hide();
          }
        }
      });
    } else if (oShowNavlistBtn.length == 0 && jQuery(".m-header-top-end").length == 1) {
      var headerBarHeight = jQuery(".m-header-top header").outerHeight();
      jQuery("body").css({
        'paddingTop': headerBarHeight + 'px'
      });
    }
  },
  createSearchPage: function () {
    var _this = this;
    var searchWord = "";
    if (jQuery("#search-word").length > 0) {
      searchWord = jQuery("#search-word").html();
    }
    if (typeof (arguments) != "undefined" && arguments.length == 1) {
      searchWord = "";
    }
    if (jQuery(".m-search-full").length == 1) {
      jQuery(".m-search-full").removeClass("m-search-full-close");
      jQuery("#search").val(searchWord);
      if (!!_this.miniScreen) {
        jQuery("#search").focus();
        kDefaultFocus();
        if (searchWord != "") {
          jQuery("#cross").show();
        }
      }
      return;
    }
    jQuery(".m-search-full").bind("click", function () {
      return false;
    });
    var searchTxt = '今日热搜';
    var oSearchWrap = jQuery('<div class="m-search-full"></div>');
    var oSearchSection = jQuery('<section class="m-search-page"></section>');
    var oSearchInput = jQuery('<div class="m-search-header"></div>');
    var oSearchKey = jQuery('<div class="bdSug_wpr search-autocomplete"></div>');
    var strInput =
        '<div class="header-searchInput"><form action="javascript:return true"><input placeholder="搜索文档或关键词" type="search" autocomplete="off" class="search-input" baidusug="2" id="search" value="'
        +
        searchWord +
        '"><i class="ico_ui ico_btn_search"></i><i id="cross" class="cross" style="display: none;"></i></form></div>';
    strInput += '<div class="header-searchBtn"><a id="search-cancel" href="javascript:void(0);">取消</a></div>';
    var idailyHot = '<div class="header-search-hot"><div class="search-tit"><h4>' + searchTxt +
        '</h4></div><div class="bd" id="search_hot"></div></div>';
    var ihistory =
        '<div class="header-search-history""><div class="search-tit"><h4>历史搜索</h4><span class="ico_btn_delete"></span></div><div class="bd"><ul id="search_history"></ul></div></div>';
    var ikey = '<ul  id="search_keys" class="search_keys"></ul>';
    oSearchInput.append(strInput);
    oSearchSection.append(oSearchInput);
    oSearchSection.append(idailyHot);
    oSearchSection.append(ihistory);
    oSearchWrap.append(oSearchSection);
    oSearchWrap.appendTo(document.body);
    oSearchKey.append(ikey);
    oSearchKey.appendTo(document.body);
    jQuery("#search").val(searchWord);
    // LoadJS(picture_image_path_v1 + "/js/opensearchsug.js?rand=201905126", 1);
    _this.clickSearchHandel();
    _this.getSearchData();
  },
  search: function () {
    console.log("回车")
  },
  getSearchData: function () {
    var _this = this;
    var aHot = aHis = aKey = "";
    //热门推荐
    var hot = ["培训方案范文", "培训方案范文", "小升初数学模拟试卷", "excel使用技巧大全", "复利现值系数表"];
    var searchHistory = ["培训方案范文", "培训方案范文", "小升初数学模拟试卷", "excel使用技巧大全", "复利现值系数表"];
    var searchKeys = ["英雄", "英朗", "英文翻译"];
    var searchListUrl = '/blog/h5page/search'; //测试链接地址
    for (var i = 0; i < hot.length; i++) {
      aHot += '<a href=' + searchListUrl + '?content=' + hot[i] + '>' + hot[i] + '</a>';
    }
    jQuery("#search_hot").append(aHot);
    //历史记录
    if (searchHistory.length > 0) {
      for (var j = 0; j < searchHistory.length; j++) {
        aHis += '<li><a href=' + searchListUrl + '>' + searchHistory[j] + '</a><span data-index=' + j +
            ' class="ico_btn_remove"></span></li>';
      }
      jQuery("#search_history").append(aHis);
    } else {
      jQuery(".header-search-history").remove();
    }
    //搜索关键字
    if (searchKeys.length > 0) {
      for (var j = 0; j < searchKeys.length; j++) {
        aKey += '<li><a href=' + searchListUrl + '>' + searchKeys[j] + '</a></li>';
      }
      jQuery("#search_keys").append(aKey);
    }
    _this.bindMethod();
  },
  clickSearchHandel: function () {
    var _this = this;
    if (jQuery(".m-search-full").length == 0) {
      return;
    }
    var oRealSearch = jQuery(".header-searchInput .search-input");
    if (!!_this.miniScreen) {
      kDefaultFocus();
    }
    if (oRealSearch.val() != "") {
      jQuery("#cross").show();
    }
    oRealSearch.bind("input propertychange", function () {
      var iVal = jQuery.trim(jQuery(this).val());
      if (iVal != "") {
        jQuery("#cross").show();
        jQuery(".search-autocomplete").show();
      } else {
        jQuery("#cross").hide();
        jQuery(".search-autocomplete").hide();
      }
    })
    oRealSearch.bind("keypress", function () {
      if (event.keyCode == "13") {
        jQuery("#cross").hide();
        jQuery(".search-autocomplete").hide();
        window.open(window.location.origin + '/blog/h5page/search?content=' + $("#search").val())
        // window.location.href = window.location.origin + '/blog/h5page/search?content=' + $("#search").val()
      }
    })
    jQuery("#cross").bind("click", function () {
      oRealSearch.val("");
      oRealSearch.focus();
      jQuery("#cross").hide();
      jQuery(".search-autocomplete").hide();
    });
    jQuery("#search-cancel").bind("click", function () {
      jQuery(".m-search-full").addClass("m-search-full-close");
      //startmove();
      // test
      // testStart();
      if ((typeof isBuild) != "undefined") {
        if (isBuild && jQuery('.selectBuildCata').length > 0) {
          jQuery('.selectBuildCata').attr('disabled', false);
        }
      }
      jQuery(".search-autocomplete").hide();
    });
  }
};
touchFun.touchFunInit();

function inputForbidTab() { //ios input调起键盘时禁止tab切换
                            // 判断是否是IOS
  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {

    jQuery('input, textarea').on('focus', function () {
      jQuery('input, textarea').not(this).attr("readonly", "readonly")
    })
    jQuery('input, textarea').on('blur', function () {
      jQuery('input, textarea').removeAttr("readonly")
    })

    jQuery('select').attr('tabindex', '-1')
  }
}
function handleChannel() {
  jQuery(".more_touch_btn").click(function() {
    jQuery(".m-channel-box").removeClass("fadeOutUp").addClass("fadeInDown");
  })
  jQuery(".header-cancel,.header-back").click(function() {
    jQuery(".m-channel-box").removeClass("fadeInDown").addClass("fadeOutUp");
  })
}
