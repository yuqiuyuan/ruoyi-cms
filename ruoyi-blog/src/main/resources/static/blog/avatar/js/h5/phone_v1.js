function getElementsByClass(searchClass, node, tag) {
    var classElements = new Array();
    if (node == null)
        node = document;
    if (tag == null)
        tag = '*';
    var els = node.getElementsByTagName(tag);
    var elsLen = els.length;
    var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
    for (i = 0, j = 0; i < elsLen; i++) {
        if (pattern.test(els[i].className)) {
            classElements[j] = els[i];
            j++;
        }
    }
    return classElements;
}

function loadImgs() {
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].getAttribute("docsrc")) {
            imgs[i].setAttribute("src", imgs[i].getAttribute("docsrc"));
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

function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}

function goBackTop() {
    var oBackTopBtn = document.getElementById("goBackTop");
    if (!oBackTopBtn) {
        return;
    }
    window.addEventListener("scroll", function () {
        var st = document.body.scrollTop + document.documentElement.scrollTop;
        var sw = window.innerHeight;
        if (oBackTopBtn) {
            if (st > sw * 0.8) {
                oBackTopBtn.style.visibility = "visible";
                oBackTopBtn.onclick = function (ev) {
                    ev.stopPropagation();
                    hideURLbar();
                };
            } else {
                oBackTopBtn.style.visibility = "hidden";
            }
        }
    }, false);
}

//show tooldiv
function showBombsDiv(id1, id2) {
    var bombDiv = jQuery("#" + id2);
    jQuery("#" + id1).toggle(function () {
        bombDiv.css({
            "display": "block"
        });
    }, function () {
        bombDiv.css({
            "display": "none"
        });
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

function addOrCancelSubscri(n) {
    var optType = 0;
    if (n == 2) {
        var aSubBtn = jQuery("#subBtn .btnSubscri");
    } else if (n == 1) {
        var aSubBtn = jQuery(".btnSubscri");
    }
    if (aSubBtn.length < 0) {
        return;
    }
    ;
    aSubBtn.bind("click", function () {
        var curObj = jQuery(this),
            cateNum = jQuery(this).attr("id").slice(4);
        if (jQuery(this).hasClass("sOkNow")) {
            optType = 1;
            jQuery(this).removeClass("sOkNow").addClass("sLoading");
            jQuery.ajax({
                type: "POST",
                url: "/touch_new/dealSubscribe.do",
                data: "tagId=" + cateNum + "&optType" + optType,
                success: function (msg) {
                    curObj.removeClass("sLoading");
                }
            });
        } else {
            jQuery(this).addClass("sLoading");
            optType = 0;
            jQuery.ajax({
                type: "POST",
                url: "/touch_new/dealSubscribe.do",
                data: "tagId=" + cateNum + "&optType=" + optType,
                success: function (msg) {
                    curObj.removeClass("sLoading").addClass("sOkNow");
                }
            });
        }
    });
}

function addOrCancelSubscri_v2(n) {
    var classOk = classLoading = "";
    //判断元素是否存在
    if (n == 2) {
        var aSubBtn = jQuery("#subBtn .btnSubscri");
        classOk = "sOkNow";
        classLoading = "sLoading"
    } else if (n == 1) {
        var aSubBtn = jQuery(".toolbar_add .ico_btn_add");
        classOk = "ico_btn_ok";
        classLoading = "ico_btn_loading"
    }
    if (aSubBtn.length < 0) {
        return;
    }
    ;

    var optType = 0; //订阅还是取消订阅的标识
    var sub = ""; //type_subId，其中type标识标签的类型(-1:普通标签, 0:股票, 1:漫画) subId为tagId或dolicstId
    var url = "";
    aSubBtn.bind("click", function () {
        var curObj = jQuery(this);
        sub = jQuery(this).attr("id").slice(4);
        var isLogin = jQuery("#isLogin").val();
        if (jQuery(this).hasClass("group")) { //需进入子标签页中订阅
            var type = -1,
                subId = 0;
            var strs = sub.split("_");
            if (strs != null) {
                if (strs.length >= 2) { //新的Id的格式：cate${type}_${subId}
                    type = parseInt(strs[0]);
                    subId = parseInt(strs[1]);
                } else if (strs.length >= 1) { //兼顾旧的Id格式：cate${tagId}
                    subId = parseInt(strs[0]);
                }
            }
            window.location.href = "/touch_new/subchild.do?tagId=" + subId;
            return;
        } else if (jQuery(this).hasClass(classOk)) { //取消订阅
            optType = 1;
            if (!isLogin || isLogin != "true") { //未登录
                showLogin(url, 0, "preType=" + optType + "&preParam=" + sub);
                return;
            }
            jQuery(this).removeClass(classOk).addClass(classLoading);
            jQuery.ajax({
                type: "POST",
                url: "/touch_new/dealSubscribe.do",
                data: "sub=" + sub + "&optType=" + optType,
                success: function (data) {
                    curObj.removeClass(classLoading);
                    if (data.state <= 0) { //操作失败
                        curObj.addClass(classOk);
                    } else {
                        clearCache(); //清除缓存
                        var contentNode = jQuery("#userTagDataDiv");
                        if (contentNode.length > 0) {
                            var ele = contentNode.find("#menuItem" + sub);
                            if (ele.length > 0) {
                                ele.remove();
                                if (contentNode.find("dd").length == 0) {
                                    contentNode.empty();
                                    contentNode.append('<dt>订阅</dt>');
                                }
                            }
                        }
                        blackOpacityTips("已取消订阅");
                    }
                }
            });
        } else { //订阅
            optType = 0;
            if (!isLogin || isLogin != "true") { //未登录
                showLogin(url, 0, "preType=" + optType + "&preParam=" + sub);
                return;
            }
            jQuery(this).addClass(classLoading);
            jQuery.ajax({
                type: "POST",
                url: "/touch_new/dealSubscribe.do",
                data: "sub=" + sub + "&optType=" + optType,
                success: function (data) {
                    curObj.removeClass(classLoading);
                    if (data.state > 0) { //操作成功
                        clearCache(); //清除缓存
                        curObj.addClass(classOk);
                        var contentNode = jQuery("#userTagDataDiv");
                        if (contentNode.length > 0) {
                            var ele = contentNode.find("#menuItem" + sub);
                            if (contentNode.find("dd").length == 0) { //没有元素
                                contentNode.empty();
                                contentNode.append('<dt><a href="/touch_new/subscribe.do" target="_self"><span class="ui_ico ui_set fr"></span>订阅</a></dt>');
                            }
                            if (ele.length <= 0 && data.retVal != null) {
                                contentNode.prepend('<dd id="menuItem' + sub + '"><a href="/touch_new/tagItem.do?type=' + data.retVal.type + '&subId=' + data.retVal.subId + '" target="_self" onMouseDown="return inpmv(4984);"><img alt="' + data.retVal.title + '" src="' + data.retVal.icon_url + '" width="20" height="20">' + data.retVal.title + '</a></dd>');
                            }
                        }
                        blackOpacityTips("已订阅成功");

                    } else {

                    }
                }
            });
        }
    });
}

//清除存在的缓存
function clearCache() {
    try {
        if (typeof (cache) != "undefined" && cache != null) {
            cache.clear();
        }
    } catch (e) {
    }
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

//验证邮箱格式
function checkEmail(email) {
    filter = /^([a-zA-Z0-9_\-\.\+]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!filter.test(email)) {
        return false;
    } else {
        return true;
    }
}

//手机号注册验证
jQuery(function () {
    var oTel = jQuery("#login_tel"),
        oPass = jQuery("#password"),
        oCheckCode = jQuery("#validateCodeTxt"),
        oGetCode = jQuery("#getvalidacode"),
        oErrorTips = jQuery("#errorTips"),
        oRegister = jQuery("#registerBt");

    var loginTelPass = false;

    if (oGetCode.length <= 0 || oTel.length <= 0 || oPass.length <= 0) {
        return;
    }

    jQuery("#login_tel,#password,#validateCodeTxt").on("focus", function () {
        oErrorTips.html("");
    });

    oRegister.on("click", function (event) {
        if (loginTelPass) { //用户名可用，继续检测密码
            checkRegisterPass();
            return false;
        } else {
            checkRegisterTel(false);
            return false;
        }
        return false;
    });

    oGetCode.on("click", function () {
        checkRegisterTel(true);
    });
    jQuery("#login_tel,#password,#validateCodeTxt").on("keydown", function (event) {
        if (event.keyCode == 13) {
            oRegister.click();
            return false;
        }
    });

    function checkRegisterTel(isGetCode) {
        var telResult = checkLoginTel(isGetCode);
        switch (telResult) {
            case 1:
                oErrorTips.html("请输入手机号").show();
                oTel.parent().parent().addClass("input_error");
                break;
            case 2:
                oErrorTips.html("手机号格式不正确").show();
                oTel.parent().parent().addClass("input_error");
                break;
            case 3:
                oErrorTips.html("手机号格式不正确").show();
                oTel.parent().parent().addClass("input_error");
                break;
        }
    }

    function checkRegisterPass() {
        var passResult = checkPwd();
        switch (passResult) {
            case 1:
                oErrorTips.html("密码不能为空，请填写").show();
                oPass.parent().parent().addClass("input_error");
                break;
            case 2:
                oErrorTips.html("密码不能包含空格").show();
                oPass.parent().parent().addClass("input_error");
                break;
            case 3:
                oErrorTips.html("密码长度不能少于6位").show();
                oPass.parent().parent().addClass("input_error");
                break;
            case 4:
                oErrorTips.html("密码长度不能多于16位").show();
                oPass.parent().parent().addClass("input_error");
                break;
            default:
                checkVcode(); //密码可用，继续检测验证码
        }
    }

    function checkVcode() {
        var codeResult = checkCodeServer();
        switch (codeResult) {
            case 1:
                oErrorTips.html("请填写验证码").show();
                oCheckCode.parent().parent().addClass("input_error");
                break;
            case 2:
                oErrorTips.html("验证码格式不正确").show();
                oCheckCode.parent().parent().addClass("input_error");
                break;
        }
    }

    //验证手机号
    function checkLoginTel(isGetCode) {
        var loginTel = oTel.val().replace(/\s*/g, "");

        var typeA = /^(13[0-3]|13[5-9]|145|147|15[0-3]|15[5-9]|170|19[8-9]|17[1-9]|18[0-9]|166)[0-9]{8}$/.test(loginTel);
        var typeB = /^(134[0-8])[0-9]{7}$/.test(loginTel);
        var telNumPass = typeA || typeB;

        if (loginTel == "") {
            return 1;
        } else if (loginTel.length != 11) {
            return 2;
        } else if (!telNumPass) {
            return 3;
        }

        if (jQuery('#getvalidacode').text() != '获取验证码') {
            return false;
        }
        jQuery.post('/jsp_cn/jquery/login/reg_check.jsp?flag=phone&login_tel=' + loginTel + "&rank=" + new Date().getTime(), function (data) {
            var flag = jQuery.trim(data.replace(/\r\n/gim, ""));
            if (flag == 0) { //手机号验证通过
                if (isGetCode) { //获取验证码
                    var getPicCode = new Factory({
                        id: "getPicCode",
                        content: '<p style="padding-bottom:20px;text-align:center;color:#333;">请输入验证码</p><div class="getPicCodeWrap clear" style="margin:0 6px;"><div class="codeWrap fl"><input style="padding:3px 5px;width:130px;margin-right:6px;border:1px solid #d2d2d2;border-radius:3px;" class="picCode" type="number" name="" /></div><div class="picWrap fr"><img style="width:68px;height:28px;cursor:pointer;" class="codePic" src="/servlet/getctime?from=addusercode&t=' + new Date().getTime() + '" name=validate_code_tel /></div></div><div style="line-height:24px;margin:0 6px;font-size:12px;" class="getPicCodeTips fcr"></div><div style="text-align:center;padding-top:16px;"><a href="javascript:;" title="确定" class="ui-btns ui-btns-confirm">确定</a></div> ',
                        btnRole: 0,
                        iClose: 1,
                        bottom: false,
                        title: false,
                        bindMethod: function () {
                            jQuery('.picCode').focus();
                            jQuery('.ui-btns-confirm').on('click', function () {
                                var codeVal = jQuery('.picCode').val();
                                if (codeVal == '') {
                                    jQuery('.getPicCodeTips').html('请输入验证码');
                                    jQuery('.picCode').focus();
                                    jQuery('.codePic').attr('src', '/servlet/getctime?from=addusercode&t=' + new Date().getTime());
                                    return;
                                } else if (codeVal.length != 5) {
                                    jQuery('.getPicCodeTips').html('验证码格式不正确');
                                    jQuery('.picCode').focus();
                                    jQuery('.codePic').attr('src', '/servlet/getctime?from=addusercode&t=' + new Date().getTime());
                                    return;
                                } else {
                                    jQuery('.getPicCodeTips').html('');
                                    loginTelPass = true;
                                    var url = "/dwrutil/createPhoneCode.do?phone=" + loginTel + "&validate_code_tel=" + codeVal + "&rank=" + new Date().getTime();

                                    jQuery.get(url, null, function (data) {
                                        var flag = jQuery.trim(data.replace(/\r\n/gim, ""));
                                        if (flag == -1) {
                                            jQuery('.getPicCodeTips').html('短信发送过于频繁，请明天再试！');
                                            //getPicCode.close();
                                        } else if (flag == -12) {
                                            jQuery('.getPicCodeTips').html('验证码错误，请重新输入');
                                            jQuery('.picCode').focus();
                                            jQuery('.codePic').attr('src', '/servlet/getctime?from=addusercode&t=' + new Date().getTime());
                                        } else if (flag == -11) {
                                            jQuery('.getPicCodeTips').html('短信发送过于频繁，请稍后再试！');
                                            //getPicCode.close();
                                        } else {
                                            //生成验证码
                                            getvalidacode(loginTel);
                                            getPicCode.close();
                                        }
                                    });
                                }
                            });
                            jQuery('#getPicCode .codePic').on('click', function () {
                                jQuery(this).attr('src', '/servlet/getctime?from=addusercode&t=' + new Date().getTime());
                            });
                        }
                    });
                } else { //点击注册//用户名可用，继续检测邮箱
                    checkRegisterPass();
                }
            } else if (flag == 1) { //用户输入的手机号已注册过（同时也包含用户名使用了此手机号进行注册）
                oErrorTips.html("此手机号已注册过").show();
                oTel.parent().parent().addClass("input_error");
            } else if (flag == 2) { //用户输入的手机号码与旧用户的用户名相同时
                oErrorTips.html("此手机号码注册异常，请您与客服联系。（企业QQ:800004241)").show();
                oTel.parent().parent().addClass("input_error");
            }
        });
    }

    //验证密码
    function checkPwd() {
        var loginPassword = oPass.val().trim();
        if (loginPassword == "") {
            return 1;
        } else if (loginPassword.indexOf(" ") > -1) {
            return 2;
        } else if (loginPassword.length < 6) {
            return 3;
        } else if (loginPassword.length > 16) {
            return 4;
        }
    }

    //验证验证码
    function checkCodeServer() {

        var code = jQuery("#validateCodeTxt").val();
        var loginTel = oTel.val().trim();

        if (code == '') {
            return 1;
        } else if (code.length != 4) {
            return 2;
        }

        var url = "/dwrutil/checkPhoneCode.do?code=" + code + "&phone=" + loginTel + "&rank=" + new Date().getTime();
        jQuery("#registerBt").addClass("pass_button_loading");
        jQuery("#registerBt").val("正在注册");
        jQuery.get(url, null, function (data) {
            var flag = (data.replace(/\r\n/gim, "")).trim();
            if (flag == 1) {
                jQuery("#login").submit();
                oErrorTips.html("").hide();
            } else if (flag == 3) {
                oErrorTips.html("验证码已过期!").show();
                jQuery("#registerBt").removeClass("pass_button_loading");
                jQuery("#registerBt").val("确定注册");
            } else if (flag == 2) {
                oErrorTips.html("验证码错误，请重新输入").show();
                jQuery("#registerBt").removeClass("pass_button_loading");
                jQuery("#registerBt").val("确定注册");
            } else if (flag == -1) {
                oErrorTips.html("验证码输入次数过多，请明天再试！").show();
                jQuery("#registerBt").removeClass("pass_button_loading");
                jQuery("#registerBt").val("确定注册");
            }
            jQuery("#validateCodeTxt").parent().parent().addClass("input_error");
        });
    }
});

//登录验证
jQuery(function () {
    var oLoginBtn = jQuery("#loginBt"),
        oUserName = jQuery("#username_new"),
        oPassword = jQuery("#password_new"),
        oErrorTips = jQuery("#errorTips"),
        oCheckCode = jQuery("#checkout");
    if (oLoginBtn.length <= 0 || oUserName.length <= 0 || oPassword.length <= 0) {
        return;
    }
    jQuery("#username_new,#password_new,#checkout").on("focus", function () {
        oErrorTips.html("").hide();
    });
    jQuery("#username_new").on("blur", function () {
        showLoginCodeTitle();
    });
    oLoginBtn.on("click", function () {
        //checkLoginInfo();
        var um = oUserName.val().trim();
        jQuery.post("/app/my/docin/showCode4LoginFalse?um=" + encodeURIComponent(um) + "&t=" + new Date().getTime(), function (data) {
            if (data != null && data != undefined && data == 1) {
                var imgsrc = jQuery("#regimg").attr("src");
                if (imgsrc == null || imgsrc.indexOf("getimg") == -1) {
                    jQuery("#regimg").attr("src", "/servlet/getimg?vfrom=loginFlase&t=" + new Date().getTime());
                }
                jQuery(".identifyCode").show();
                jQuery("#showcode4logintitle").val(1);
            } else {
                jQuery(".identifyCode").hide();
                jQuery("#showcode4logintitle").val(0);
            }
            checkLoginInfo();
        });
    });
    jQuery("#username_new,#password_new,#checkout").on("keydown", function (event) {
        if (event.keyCode == 13) {
            oLoginBtn.click();
            return false;
        }
    });

    //检测是否是正确的用户名和密码
    function checkLoginInfo() {
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        var oUserNameVal = oUserName.val().trim(),
            oPassVal = oPassword.val().trim(),
            loginfalsecode = oCheckCode.val().trim(),
            showcode4login = jQuery("#showcode4logintitle").val(),
            illegal = reg.test(oUserNameVal);
        if (oUserNameVal == "" || oPassVal == "") {
            //oUserName.parent().parent().addClass("input_error");
            oErrorTips.html("用户名或密码不能为空").show();
            return false;
        }
        if (illegal || oPassVal.length < 6) {
            //oPassword.parent().parent().addClass("input_error");
            oErrorTips.html("用户名或密码错误").show();
            return false;
        }
        if (jQuery("#showcode4logintitle").val() == 1 && jQuery("#checkout").val() == "") {
            oCheckCode.parent().parent().addClass("input_error");
            oErrorTips.html("请输入验证码").show();
            return false;
        }
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        var oUserNameVal = oUserName.val().trim(),
            oPassVal = oPassword.val().trim(),
            loginfalsecode = oCheckCode.val().trim(),
            showcode4login = jQuery("#showcode4logintitle").val(),
            illegal = reg.test(oUserNameVal);
        jQuery("#loginBt").addClass("login_button_loading").val("正在登录");
        jQuery.post("/app/loginAjax/userLoginAjax.do?t=" + new Date().getTime(), {
            username: oUserNameVal,
            password: oPassVal,
            showcode4login: showcode4login,
            loginfalsecode: loginfalsecode
        }, function (data) {
            var flag = (data.replace(/\r\n/gim, "")).trim();
            if (flag == 1) {
                jQuery("#login").submit();
            } else if (flag == 2) {
                //oUserName.parent().parent().addClass("input_error");
                oErrorTips.html("用户名或密码错误").show();
                jQuery("#loginBt").removeClass("login_button_loading").val("登录");
            } else if (flag == 3) {
                jQuery("#checkout").val("");
                jQuery("#regimg").attr("src", "/servlet/getimg?vfrom=loginFlase&t=" + new Date().getTime());
                jQuery("#checkout").parent().parent().addClass("input_error");
                oErrorTips.html("验证码错误，请重新输入").show();
                jQuery("#loginBt").removeClass("login_button_loading").val("登录");
            } else if (flag == 4) {
                showLoginSign("请验证后完成登录", function () {
                    jQuery("#login").submit();
                });
            }
        });
    }

    //检测是否需要验证码
    function showLoginCodeTitle() {
        var um = oUserName.val().trim();
        jQuery.post("/app/my/docin/showCode4LoginFalse?um=" + encodeURIComponent(um) + "&t=" + new Date().getTime(), function (data) {
            if (data != null && data != undefined && data == 1) {
                jQuery("#regimg").attr("src", "/servlet/getimg?vfrom=loginFlase&t=" + new Date().getTime());
                jQuery(".identifyCode").show();
                jQuery("#showcode4logintitle").val(1);
            } else {
                jQuery(".identifyCode").hide();
                jQuery("#showcode4logintitle").val(0);
            }
        });
        jQuery("#regimg,#changeImg").on("touchstart", function () {
            if (jQuery("#checkout").length > 0) {
                jQuery("#checkout").val("");
                jQuery("#regimg").attr("src", "/servlet/getimg?vfrom=loginFlase&t=" + new Date().getTime());
            }
        });
    }

    function loginSubmitFunction() {
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        var oUserNameVal = oUserName.val().trim(),
            oPassVal = oPassword.val().trim(),
            loginfalsecode = oCheckCode.val().trim(),
            showcode4login = jQuery("#showcode4logintitle").val(),
            illegal = reg.test(oUserNameVal);
        jQuery.post("/app/loginAjax/userLoginAjax.do?t=" + new Date().getTime(), {
            username: oUserNameVal,
            password: oPassVal,
            showcode4login: showcode4login,
            loginfalsecode: loginfalsecode
        }, function (data) {
            var flag = (data.replace(/\r\n/gim, "")).trim();
            if (flag == 1) {
                jQuery("#login").submit();
            } else if (flag == 2) {
                oErrorTips.html("用户名或密码错误！").show();
            } else if (flag == 3) {
                jQuery("#checkout").val("");
                jQuery("#regimg").attr("src", "/servlet/getimg?vfrom=loginFlase&t=" + new Date().getTime());
                oErrorTips.html("验证码错误，请重新输入").show();
            }
        });
    }
});

//登录
function showLogin(url, type, param) {
    if (url == null || url.length <= 0) {
        url = window.location.href;
    }
    if (param != null && url != null) {
        if (url.indexOf("?") < 0) {
            url = url + "?" + param;
        } else {
            url = url + "&" + param;
        }
    }
    if (type && type == 1) {
        window.location.href = "/touch_new/showLogin.do?forwardUrl=" + encodeURIComponent(url) + "&type=1";
    } else {
        window.location.href = "/touch_new/showLogin.do?forwardUrl=" + encodeURIComponent(url);
    }

}

//注册
function showRegister(url) {
    if (url == null || url.length <= 0) {
        url = window.location.href;
    }
    window.location.href = "/touch_new/showRegister.do?forwardUrl=" + encodeURIComponent(url);
}

//隐藏地址栏
function hideURLbar() {
    setTimeout(scrollTo, 100, 0, 1);
}

//切换至电脑版
function toComputer() {
    jQuery.post('/mobile/addCookie.do', {
        name: "computerversion",
        time: 1
    }, function () {
        window.location.href = "/";
    });
}

function touch_back() {
    var referUrl = (document.referrer ? document.referrer : "");

    if (referUrl != "") {
        var reg = /.docin.com/g;
        if (!reg.test(referUrl)) {
            turnTo("/touch_new/index.do");
        } else {
            if (window.location.href.indexOf('touch_new/build/index.do') != -1) {
                turnTo("/touch_new/index.do");
            } else {
                window.history.back();
            }
        }
    } else {
        // turnTo("/touch_new/index.do");
        if ((typeof isBuild) != "undefined") {
            if (isBuild) {

                turnTo("/touch_new/build/index.do");
            } else {
                turnTo("/touch_new/index.do");
            }
        } else {
            turnTo("/touch_new/index.do");
        }
    }
}

function turnTo(url, pageNum) {
    if (!url) {
        return;
    }
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent) || /MSIE(\d+\.\d+);/.test(navigator.userAgent)) {
        var referLink = document.createElement('a');
        if (pageNum != null && pageNum > 1) {
            if (url.indexOf("?") > 0) {
                url = url + "&prePageNum=" + pageNum;
            } else {
                url = url + "?prePageNum=" + pageNum;
            }
        }
        referLink.href = url;
        document.body.appendChild(referLink);
        referLink.click();
    } else {
        if (pageNum != null && pageNum > 1) {
            if (url.indexOf("?") > 0) {
                url = url + "&backPageNum=" + pageNum;
            } else {
                url = url + "?backPageNum=" + pageNum;
            }
        }
        location.href = url;
    }
}

//切换豆单和文档
function switchItem(id) {
    var aBtns = document.getElementById(id);
    if (!aBtns) {
        return;
    }
    var span_btn = aBtns.getElementsByTagName("span");
    var show_div1 = document.getElementById("box1"),
        show_div2 = document.getElementById("box2");
    for (var i = 0; i < span_btn.length; i++) {
        span_btn[i].index = i;
        span_btn[i].onclick = function () {
            switch (this.index) {
                case 0: //文档
                    if (hasClass(this, "on1")) {
                        return;
                    } else {
                        tab();
                        addClass(this, "on1");
                        show_div1.style.display = "block";

                    }
                    break;
                case 1: //豆单
                    if (hasClass(this, "on2")) {
                        return;
                    } else {
                        tab();
                        addClass(this, "on2");
                        show_div2.style.display = "block";
                    }
                    break;
            }
        };
    }

    function tab() {
        removeClass(span_btn[0], "on1");
        removeClass(span_btn[1], "on2");
        show_div1.style.display = "none";
        show_div2.style.display = "none";
    }
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

function skip(url, index) {
    if (index == 0) {
        turnTo(url, currentIndex0 - 1);
    } else if (index == 1) {
        turnTo(url, currentIndex1 - 1);
    } else {
        turnTo(url, currentIndex - 1);
    }

}

function submitTo() {
    var key = jQuery("#search").val().trim();
    if (jQuery("#search").length <= 0) {
        return;
    }
    if (key == "" || key.length == 0) {
        return false;
    }
    window.location.href = "/touch_new/search_novel.do?rkey=" + key;
}

function submitTo1(prefix_url) {
    var key = jQuery("#search").val().trim();
    if (jQuery("#search").length <= 0) {
        return;
    }
    if (key == "" || key.length == 0) {
        return false;
    }
    var _prefix_url = prefix_url;
    if (typeof (prefix_url) == 'undefined' || prefix_url == null || prefix_url == '') {
        _prefix_url = "";
    }
    var submitUrl = _prefix_url + "/touch_new/search.do?rkey=" + key;
    if (typeof (isBuild) != "undefined" && isBuild == true) {
        submitUrl = submitUrl + "&isBuild=true";
    }
    window.location.href = submitUrl;
}

function setCookie2008_1(name, value, day) {
    str = name + "=" + escape(value);
    if (day > 0) {
        expires = day * 24 * 60;
        exp = new Date();
        exp.setTime(exp.getTime() + expires * 60 * 1000);
        str += "; expires=" + exp.toGMTString();
        str += "; path=/";
        if (location.href.indexOf("docin.com") == -1) {
            str += "; domain=.douding.cn";
        } else {
            str += "; domain=.docin.com";
        }
    }
    document.cookie = str;
}

//get cookie by cookie's name
//name(String): cookie's name
function getCookie2008_1(name) {
    var tmp, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)", "gi");
    if (tmp = reg.exec(unescape(document.cookie))) return (tmp[2]);
    return null;
}

function delCookie(name) { //为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + "=a; expires=" + date.toGMTString();
}

//显示对话框
function showDialog(id) {
    createShadow(id);
    setDialogCenter(id);
}

//设置对话框居中
function setDialogCenter(id) {
    var obj = jQuery("#" + id);
    var oLeft = (jQuery(window).width() - obj.outerWidth()) / 2,
        oTop = jQuery(window).scrollTop() + (jQuery(window).height() - obj.outerHeight()) / 2;
    obj.css({
        left: oLeft,
        top: oTop
    }).show();
}

//创建遮罩
function createShadow() {
    jQuery('<div id="dialogShadow" style="position:fixed;left:0;top:0;bottom:0;right:0;width:100%;background-color:#000;opacity:0.4;filter:alpha(opacity=40);z-index:99;"></div>').appendTo(document.body);
}

//移除遮罩
function removeShadow() {
    jQuery("#dialogShadow").remove();
}

//关闭对话框
function cancelDialog(id) {
    var obj = jQuery("#" + id);
    obj.hide();
    removeShadow();
}

//定时关闭对话框 id:对话框id，secid：秒的变化的id，sec：秒数
function secCountClose(id, secid, sec) {
    if (jQuery("#" + id).length == 0) {
        return;
    }
    var t = sec;
    jQuery("#" + secid).html(t);
    var closeTimer = setInterval(function () {
        t--;
        if (t == 0) {
            clearTimeout(closeTimer);
            cancelDialog(id);
        } else {
            jQuery("#" + secid).html(t);
        }
    }, 1000)
}

/* 点击发送手机验证码 */
(function () {
    var waitTimer = null,
        wait = 60;

    //验证码发送提示
    function msgSendTips(loginTel) {
        var oTips = jQuery('<div id="msgSendTips">验证码已发送，请查看手机</div>');
        jQuery('body').append(oTips);
        setTimeout(function () {
            jQuery('#msgSendTips').remove();
        }, 3000);
    }

    //验证码倒计时
    function time(id) {
        var o = jQuery("." + id);

        if (wait == 0) {
            o.html('获取验证码');
            wait = 60;
            waitTimer = null;
        } else {
            o.html('重新发送(' + wait + ')');
            waitTimer = setTimeout(function () {
                    time(id);
                    wait--;
                },
                1000);
        }

    }

    function getvalidacode(loginTel) {
        if (waitTimer) {
            return false;
        }
        msgSendTips(loginTel);
        time("getvalidaCodeBtn");
    }

    window.getvalidacode = getvalidacode;
})(window);
(function () {
    var oCloseFloatBtn = jQuery(".float_ad_Wrap .close_btn_con");
    if (oCloseFloatBtn.length > 0) {
        oCloseFloatBtn.bind("click", function () {
            var oParent = jQuery(this).parent().parent();
            var oParentId = oParent.attr("id");
            oParent.remove();
            setCookie2008_1(oParentId, 1, 365);
        });
    }
})();

//统计在线时长
function visit_timing(from) {
    var start_time;
    var end;
    var state;
    var leave = 0,
        come = 0,
        jian = 0;
    start_time = new Date(); //start是用户进入页面时间
    function pageVisibilitySupport() {
        var support = false;
        if (typeof window.screenX === "number") {
            ["webkit", "moz", "ms", "o", ""].forEach(function (prefix) {
                if (support == false && document[prefix + (prefix ? "H" : "h") + "idden"] + "" !== "undefined") {
                    support = true;
                }
            });
        }
        return support;
    }

    function handleVisibilityChange() {
        var url = "/jsp_cn/test/time.jsp";
        if (document.visibilityState == "hidden") { //离开页面
            leave = new Date().getTime();
        } else { //回到页面
            come = new Date().getTime();
            jian = jian + (come - leave);
        }
    }

    var isPageVisibilitySupport = pageVisibilitySupport();
    if (isPageVisibilitySupport) {
        document.addEventListener("visibilitychange", handleVisibilityChange, false);
    }
    var url = "/jsp_cn/test/time.jsp";
    jQuery(window).unload(function () { //页面卸载，就是用户关闭页面、点击链接跳转到其他页面或者刷新页面都会执行
        end = new Date(); //用户退出时间
        state = end.getTime() - start_time.getTime();
        jQuery.post(url, {
            type: from,
            timeLength: state
        });
    });
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

LoadJS("/js/clipboard.min.js", 1); //加载剪切板
function kDefaultFocus() {
    var d = document,
        k = d.getElementById('search');
    if (!k) return false;
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

//搜索自动提示框的匹配词点击量
function check_v1() {
    inpmv(5914);
    if (jQuery("#search").length <= 0) {
        return;
    }
    var rkey = jQuery("#search").val().trim();
    if (rkey == "" || rkey.length == 0) {
        return false;
    }
    return true;
}

//搜索自动提示框的匹配词点击量
function searchNovel() {

    if (jQuery("#search").length <= 0) {
        return;
    }
    var rkey = jQuery("#search").val().trim();
    if (rkey == "" || rkey.length == 0) {
        window.parent.location.href = "/touch_new/search_novel.do";
    }
    window.parent.location.href = "/touch_new/search_novel.do?rkey=" + rkey;
}

function docin_adload(type, parentId) {
    //type 0:img 1:text 3:code
    if (jQuery("#" + parentId).length == 0) {
        return false;
    }
    var moneyUrl = '/docin_adv/adv.do?pos=' + type;
    var oIframe = jQuery('<iframe width="100%" height="100%" scrolling="no" frameborder="0" style="display:block;margin:0 auto;" src="' + moneyUrl + '"></iframe>').appendTo(jQuery("#" + parentId));
}

/**构造函数*/
Factory = function (configs) {
    var _i = this,
        c = _i.options;
    _i.config = $.extend({}, c, configs);

    //实例化弹窗
    if (!(_i instanceof Factory)) {
        return new Factory(configs);
    }
    _i.init();
};
Factory.prototype = {
    options: {
        dom: "docin-ui-pop", //标识弹窗，用于关闭所有
        id: "uiPop", //弹窗ID (不同ID对应不同弹窗)
        title: "提示", //标题(为false时隐藏标题)
        iClose: 0, //是否有关闭按钮  0 没有  1  有
        content: "", //消息内容
        type: "", //图标类型 warning|error|success|confirm
        padding: "20px", //内容填充区域
        lock: 1, //锁定屏幕(遮罩)
        fixed: false, //是否固定定位
        zIndex: 9999, //设置元素层叠
        time: 0, //定时关闭
        btn: "确定", //按钮(String/Array) 	btn:"确定" | btn:["确定", "取消"] | btn: ['按钮1', '按钮2', '按钮3', …]
        btnRole: 0, //1:确定 2：取消  3:两个按钮都是蓝色  4:确定+取消
        onShow: null, //打开弹窗成功回调方法
        onOk: null, //确定按钮回调方法
        onOk2: null, //仅在设置参数btnRole:3 有效
        onClose: null, //关闭按钮回调方法
        bottom: true, //底部(为false时隐藏底部)
        alpha: [".4", "#000"], //设置遮罩层背景及透明度
        skinPath: "skin/", //css或image路径
        bindMethod: null
    },
    init: function () {
        var _i = this,
            opt = _i.config,
            c = null,
            popWin = null,
            offsetL, offsetT;

        _i.isfixed = (opt.fixed || opt.time) ? true : false;

        if ($("#" + opt.id)[0])
            return;

        c = $("<div id='" + opt.id + "' class='" + opt.dom + "'></div>");
        var strClose = '<span class="docin-ui-close"></span>',
            strTitle = '<div class="docin-ui-title">' + opt.title + '</div>';
        c.html(
            /**遮罩*/
            (opt.lock ? '<div class="docin-ui-overlay"></div>' : '')
            /**窗体*/
            +
            '<div class="docin-ui-wrapper anim-ui-wrapper">'
            /*标题区域*/
            +
            (opt.title ? (opt.iClose ? '<div class="docin-ui-head">' + strTitle + strClose + '</div>' : '<div class="docin-ui-head">' + strTitle + '</div>') : (opt.iClose ? '<div class="docin-ui-head">' + strClose + '</div>' : ''))
            /*内容区域*/
            +
            '<div class="docin-ui-body" style="padding:' + opt.padding + ';">' +
            (opt.type ? '<div style="text-align:center;"><span style="background:url(' + opt.skinPath + opt.type + '_icon.gif) no-repeat 0 center;display:inline-block;padding:0.75rem 0 0.75rem 2.625rem;">' + opt.content + '</span></div>' : opt.content) +
            '</div>'
            /*底部区域*/
            +
            (opt.bottom && opt.btn ? function () {
                /*定义多个按钮*/
                var btn = "";
                if (typeof opt.btn === "string") {
                    opt.btn = [opt.btn];
                    if (opt.btnRole == 1) {
                        btn += '<div class="ui-btns-box"><a class="ui-btns ui-btns-confirm">' + opt.btn + '</a></div>';
                    } else if (opt.btnRole == 2) {
                        btn += '<div class="ui-btns-box"><a class="ui-btns ui-btns-cancel">' + opt.btn + '</a></div>';
                    }
                } else {
                    if (opt.btnRole == 3) {
                        $.each(opt.btn, function (i, v) {
                            btn += '<div class="ui-btns-box"><a class="ui-btns docin_ui_btn1">' + v + '</a></div>';
                        });
                    } else if (opt.btnRole == 5) { //第一个蓝色 第二个灰色
                        btn = '<div class="ui-btns-box"><a class="ui-btns ui-btns-confirm">' + opt.btn[0] + '</a></div><div class="ui-btns-box"><a class="ui-btns ui-btns-cancel">' + opt.btn[1] + '</a></div>'
                    } else {
                        $.each(opt.btn, function (i, v) {
                            btn += '<div class="ui-btns-box"><a class="ui-btns docin_ui_btn' + i + '">' + v + '</a></div>';
                        });
                    }

                }
                //typeof opt.btn === "string" && (opt.btn = [opt.btn]);

                return '<div class="docin-ui-foot">' +
                    '<div class="docin-ui-btns">' + btn + '</div>'
                '</div>'
            }() : '') +
            '</div>'
        );
        $("body").append(c); //插入到body最后

        /**锁屏设置*/
        _i.overlay = c.find(".docin-ui-overlay");
        _i.overlay.css({
            "background-color": opt.alpha[1] || "#000",
            "opacity": 0,
            //"z-index": _i.maxIndex() + 1
            "z-index": 999
        }).fadeTo(300, opt.alpha[0]);

        _i.popWin = popWin = c.find(".docin-ui-wrapper");
        popWin.css({
            "position": _i.isfixed ? "fixed" : "absolute",
            //"z-index": _i.maxIndex() + 1
            "z-index": 1000
        });
        offsetL = ($(window).width() - popWin.outerWidth()) / 2;
        offsetT = ($(window).height() - popWin.outerHeight()) / 2;

        /**弹窗定位*/
        popWin.css({
            "left": _i.isfixed ? offsetL : $(document).scrollLeft() + offsetL,
            "top": _i.isfixed ? offsetT : $(document).scrollTop() + offsetT
        });

        /**弹窗重置*/
        _i.setPos = function () {
            if (!_i.isfixed) {
                popWin.css({
                    "left": $(document).scrollLeft() + ($(window).width() - popWin.outerWidth()) / 2,
                    "top": $(document).scrollTop() + ($(window).height() - popWin.outerHeight()) / 2
                });
            } else {
                popWin.css({
                    "left": ($(window).width() - popWin.outerWidth()) / 2,
                    "top": ($(window).height() - popWin.outerHeight()) / 2
                });
            }
        }
        $(window).resize(_i.setPos);

        _i.ui_overlay = c.find(".docin-ui-overlay");
        _i.ui_close = c.find(".docin-ui-close");

        //弹窗事件
        _i.callback();
        if (opt.bindMethod) {
            opt.bindMethod(_i);
        }
    },
    callback: function () {
        var _i = this,
            opt = _i.config;

        opt.onShow && opt.onShow(_i);
        //弹窗自动关闭
        if (opt.time) {
            setTimeout(function () {
                _i.close();
            }, opt.time * 1000);
        }

        //按钮事件
        _i.popWin.find(".docin-ui-btns a").on("click", function () {
            var index = $(".docin-ui-btns a").index(jQuery(this));
            if (opt.btnRole == 3) {
                if (index === 0) {
                    opt.onOk ? (opt.onOk(_i)) : _i.close();
                } else if (index === 1) {
                    opt.onOk2 ? (opt.onOk2(_i), _i.close()) : _i.close();
                }
            } else if (opt.btnRole == 5) { //第一个是蓝色的，第二个是灰色
                if (index === 0) {
                    opt.onOk ? (opt.onOk(_i), _i.close()) : _i.close();
                } else {
                    _i.close();
                }
            } else {
                if (index === 0) { //默认是取消按钮 [第一个按钮，可以写btn1]
                    if (opt.btnRole == 1) {
                        opt.onOk ? (opt.onOk(_i), _i.close()) : _i.close();
                    } else {
                        _i.close();
                    }
                } else if (index === 1) { //默认是确认按钮 [第二个按钮，可以写btn2]
                    opt.onOk ? (opt.onOk(_i), _i.close()) : _i.close();
                } else {
                    opt["btn" + (index + 1)] && _i.close();
                }
                opt["btn" + (index + 1)] && opt["btn" + (index + 1)](_i);
            }
        });
        //右上角关闭
        if (_i.ui_close[0]) {
            _i.ui_close.on("click", function () {
                _i.close();
            });
        }

        //点击锁屏重置窗体位置 (双击关闭弹窗)
        _i.ui_overlay.on("click", function () {
            _i.setPos();
        });
    },
    //关闭弹窗
    close: function () {
        var _i = this,
            opt = _i.config;

        if ($("#" + opt.id)) {
            $("#" + opt.id).remove();
        }
        opt.onClose && opt.onClose(_i); //执行关闭事件
        _i = null;
    },
    //关闭页面所有弹窗(根据页面唯一弹窗标识)
    closeAll: function () {
        $("." + this.config.dom).each(function () {
            $(this).remove();
        });
    },
    //获取弹窗最大层级
    maxIndex: function () {
        for (var idx = this.config.zIndex, elem = $("*"), i = 0, len = elem.length; i < len; i++)
            idx = Math.max(idx, elem[i].style.zIndex);
        return idx;
    }
};

function setWaitingShow() {
    var oWaiting = jQuery(".waitingShow");
    if (oWaiting.size() == 0) {
        return;
    }
    var oMarginL = -oWaiting.outerWidth() / 2;
    oWaiting.css("margin-left", oMarginL + "px");
}

(function () {
    var oCloseAdBtn = jQuery(".float_ad_Wrap .close_btn_icon");
    if (oCloseAdBtn.length > 0) {
        oCloseAdBtn.click(function () {
            jQuery(".float_ad_Wrap").hide();
            jQuery('div[id^="BAIDU_SSP__wrapper_u"]').hide();
            var j_vip_tips = new Factory({
                id: "j_closeAdTips",
                iClose: 1,
                content: '<p style="font-size:16px;line-height:24px;text-align:center;"><img src="' + picture_image_path_v1 + '/images_cn/iphone/ico_vip_tips.png" width="60" /><br/>开通<a onmousedown="return inpmv(5928);" href="/touchPay/touch_vip.do?source=closeAdv" style="text-decoration:underline;" target="_blank">VIP会员</a><br/>为您将广告一扫光</p>',
                btn: "开通会员",
                btnRole: 1,
                title: false,
                padding: "15px",
                onOk: function () {
                    var oReferer = window.location.href;
                    setCookie2008_1("closeVipCookie", oReferer, 365);
                    window.open("/touchPay/touch_vip.do?source=closeAdv", "_blank");
                    inpmv(5929); //开通VIP按钮点击次数
                }
            });
            inpmv(5930); //广告提示层关闭次数
        });
    }
    qqkefuCopyData(); //qq客服
})();

function openVipGuide() { //1:开通vip 2:开通建筑vip 3：开通plus
    if (rechargeConfig.isVip == "false") { //不是会员，引导购买会员
        openVipGuideTip(1, "adv");
    }

    // if (typeof (rechargeConfig) == "undefined") {
    // 	return;
    // }
    // var iVipType = 1;
    // if (rechargeConfig.isVip == "false") { //不是会员，引导购买会员
    // 	if (rechargeConfig.isBuildProduct == false) {
    // 		iVipType = 1;
    // 	} else {
    // 		iVipType = 2
    // 	}
    // }
    // var str = "",
    // 	iUrl = "";
    // if (iVipType == 1) {
    // 	str = "VIP";
    // 	iUrl = '/touchPay/touch_vip.do?vip_from=closeAdv&pid=' + rechargeConfig.pid;
    // } else if (iVipType == 2) {
    // 	str = "建筑会员";
    // 	iUrl = '/jsp_cn/touch/build/build_vip.jsp?vip_from=closeAdv_build&pid=' + rechargeConfig.pid;
    // } else if (iVipType == 3) {
    // 	str = "PLUS会员";
    // }
    // window.location.href = iUrl;
}

function docinShare(n, event, from1, id) { //n: 1-新浪微博2-QQ空间3-人人4-腾讯微博5-QQ好友6-微信 form: //1:专题  2：终极页  3：豆单  4：书房   5：商业工具
    if (typeof (docinShareConfig) == "undefined") {
        return false;
    }
    var conf = docinShareConfig;
    var _title = conf.title,
        _source = conf.source,
        _sourceUrl, _pic, _showcount, _desc, _summary, _site,
        _width = 600,
        _height = 600,
        _top = (screen.height - _height) / 2,
        _left = (screen.width - _width) / 2,
        _url = conf.url,
        _pic = conf.pic,
        _desc = conf.desc,
        _site = 'docin',
        _titleWB = conf.titleWB,
        _summary = conf.summary;

    if (n == 1) {
        shareToSinaWB(event);
    } else if (n == 2) {
        shareToQzone(event);
    } else if (n == 3) {
        shareToRenren(event);
    } else if (n == 4) {
        shareToQQwb(event);
    } else if (n == 5) {
        shareToQQFriend(event);
    } else if (n == 6) {
        shareToWeixin(event);
    }
    shareAnylize(from1, id, n);

    function shareAnylize(from1, id, snstype) {
        //from 1:专题  2：终极页  3：豆单  4：书房   5：其他活动   无id填0
        jQuery.post('/jsp_cn/stat/shareStat.jsp', {
            'from': from1,
            'id': id,
            'snstype': snstype
        });
    }

    function shareToSinaWB(event) {
        var _shareUrl = 'http://v.t.sina.com.cn/share/share.php?&appkey=750339144'; //真实的appkey，必选参数
        _shareUrl += '&url=' + encodeURIComponent(_url || document.location); //参数url设置分享的内容链接|默认当前页location，可选参数
        _shareUrl += '&title=' + encodeURIComponent(_titleWB || document.title); //参数title设置分享的标题|默认当前页标题，可选参数
        _shareUrl += '&source=' + encodeURIComponent(_source || '');
        _shareUrl += '&sourceUrl=' + encodeURIComponent(_sourceUrl || '');
        _shareUrl += '&content=' + 'utf-8'; //参数content设置页面编码gb2312|utf-8，可选参数
        _shareUrl += '&pic=' + encodeURIComponent(_pic || ''); //参数pic设置图片链接|默认为空，可选参数
        window.open(_shareUrl, '_blank', 'width=' + _width + ',height=' + _height + ',top=' + _top + ',left=' + _left + ',toolbar=no,menubar=no,scrollbars=no, resizable=1,location=no,status=0');
        return false;
    }

    function shareToQzone(event) {
        var _shareUrl = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
        _shareUrl += 'title=' + encodeURIComponent(_title || document.title); //参数title设置分享标题，可选参数
        _shareUrl += '&url=' + encodeURIComponent(_url || document.location); //参数url设置分享的内容链接|默认当前页location
        _shareUrl += '&pics=' + encodeURIComponent(_pic || ''); //参数pics设置分享图片的路径，多张图片以＂|＂隔开，可选参数
        window.open(_shareUrl, '_blank', 'width=' + _width + ',height=' + _height + ',top=' + _top + ',left=' + _left + ',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
        return false;
    }

    function shareToRenren(event) {
        var _shareUrl = 'http://widget.renren.com/dialog/share?';
        _shareUrl += 'resourceUrl=' + encodeURIComponent(_url || location.href); //分享的链接
        _shareUrl += '&title=' + encodeURIComponent(_title || document.title); //分享的标题
        window.open(_shareUrl, '_blank', 'width=' + _width + ',height=' + _height + ',left=' + _left + ',top=' + _top + ',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
        return false;
    }

    function shareToQQwb(event) {
        var _shareUrl = 'http://v.t.qq.com/share/share.php?';
        _shareUrl += 'title=' + encodeURIComponent(_title || document.title); //分享的标题
        _shareUrl += '&url=' + encodeURIComponent(_url || location.href); //分享的链接
        //_shareUrl += '&appkey=5bd32d6f1dff4725ba40338b233ff155';    //在腾迅微博平台创建应用获取微博AppKey
        _shareUrl += '&site=' + encodeURIComponent(_site || ''); //分享来源
        _shareUrl += '&pic=' + encodeURIComponent(_pic || ''); //分享的图片，如果是多张图片，则定义var _pic='图片url1|图片url2|图片url3....'
        window.open(_shareUrl, '_blank', 'width=' + _width + ',height=' + _height + ',left=' + _left + ',top=' + _top + ',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
        return false;
    }

    function shareToQQFriend(event) {

        var _shareUrl = 'https://connect.qq.com/widget/shareqq/index.html?';
        _shareUrl += 'summary=' + encodeURIComponent(_summary || '分享摘要');
        _shareUrl += '&url=' + encodeURIComponent(_url || location.href); //分享的链接
        _shareUrl += '&pics=' + encodeURIComponent(_pic || ''); //参数pics设置分享图片的路径，多张图片以＂|＂隔开，可选参数
        window.open(_shareUrl, '_blank', 'width=' + _width + ',height=' + _height + ',left=' + _left + ',top=' + _top + ',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
        return false;
    }

    function shareToWeixin() {
        var contentStr = '<img id="dimcode_wx" width="185" height="185" alt="获取二维码" title="获取二维码"><p style="color:#666;line-height:22px;text-align:left;">打开微信，点击底部的“发现”，使用“扫一扫”即可将网页分享至朋友圈。</p>';
        var ddWeixinShare = new CreateDocinDialog({
            title: '分享到微信朋友圈',
            id: 'j_WXShare',
            cls: 'docinWxPop',
            content: contentStr,
            button: 2,
            shadow: 2,
            init: function () {
                var dimPic = document.getElementById("dimcode_wx");
                dimPic.src = "/servlet/get2wm?doc_end_url=" + _url;
            }
        });
        return false;
    }
}

(function ($) {
    $.extend({
        tipsBox: function (options) {
            options = $.extend({
                obj: null, //jq对象，要在那个html标签上显示
                str: "+1", //字符串，要显示的内容;也可以传一段html，如: "<b style='font-family:Microsoft YaHei;'>+1</b>"
                startSize: "12px", //动画开始的文字大小
                endSize: "30px", //动画结束的文字大小
                interval: 600, //动画时间间隔
                color: "red", //文字颜色
                callback: function () {
                } //回调函数
            }, options);
            $("body").append("<span class='num'>" + options.str + "</span>");
            var box = $(".num");
            var left = options.obj.offset().left + options.obj.width() / 2;
            var top = options.obj.offset().top - options.obj.height() / 2;
            box.css({
                "position": "absolute",
                "left": left + "px",
                "top": top + "px",
                "z-index": 9999,
                "font-size": options.startSize,
                "line-height": options.endSize,
                "color": options.color
            });
            box.animate({
                "font-size": options.endSize,
                "opacity": "0",
                "top": top - parseInt(options.endSize) + "px"
            }, options.interval, function () {
                box.remove();
                options.callback();
            });
        }
    });
})(jQuery);
(function () {
    if (jQuery("#closeAppRecom").length > 0) {
        jQuery("#closeAppRecom").bind("click", function () {
            setCookie2008_1('appTipVisited', '1', 365);
            jQuery("#indexAppRecom").hide();
        });
    }

})();

function checkDevice() { //检测设备android ios
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        return 1;
    } else if (isiOS) {
        return 2;
    }
}

function openShareWeixin() { //微信分享
    var shareBgImg = "";
    if (checkDevice() == 1) { //android
        shareBgImg = 'android_share.png';
    } else if (checkDevice() == 2) { //ios
        shareBgImg = 'ios_share.png';
    }
    jQuery("#shareBox").hide();
    jQuery("#mask").remove();
    var oWeixinTip = jQuery('<div id="weixinShareDiv" style="width:100%;height:100%;position:fixed;top:0;z-index:1007;background:rgba(0,0,0,0.75) url(' + picture_image_path_v1 + '/images_cn/iphone/miniDocin/' + shareBgImg + ') center 65% no-repeat;background-size:70% auto;"></div>').appendTo(jQuery("body"));
    jQuery("#weixinShareDiv").click(function () {
        jQuery(this).remove();
    });
}

function docinTouchShare(pid, fromid) {
    LoadJS(picture_image_path_v1 + "/js/mobile/touchNativeShare.js", false);
    if (jQuery("#doc-share").length == 0 && jQuery("#shareSns").length == 0) {
        return;
    }
    document.querySelector('#doc-share,#shareSns').addEventListener("click", function () {
        var UA = navigator.appVersion;
        var is_weixin = UA.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
        if (((UA.split("MQQBrowser/").length > 1 && browser.versions.android) || UA.split("UCBrowser/").length > 1) && !is_weixin) { //
            mshare.init(0);
        } else {
            var shareContent = "";
            var shareContent = '<ul class="docin_share_sns"><li id="qqshare"><span class="ico_docin_sns ico_share_qq_01"></span><span class="sns_text">QQ好友</span></li><li onclick="docinShare(1,event,' + fromid + ',' + pid + ');"><span class="ico_docin_sns ico_share_weibo_01"></span><span class="sns_text">新浪微博</span></li><li id="qzoneshare"><span class="ico_docin_sns ico_share_qzone_01"></span><span class="sns_text">QQ空间</span></li><li id="copy_cur_link"><span class="ico_docin_sns ico_share_copylink_01"></span><span class="sns_text">复制链接</span></li></ul>';
            var shareTxt = "";
            if (browser.versions.weixin) {
                shareTxt = '<span class="share_to_text">轻触手机屏幕右上角<span class="ico_share_open_01"></span> 图标即可分享到微信好友或朋友圈。</span>';
            } else if (browser.versions.ios) {
                shareTxt = '<span class="share_to_text">请<a id="copyLink" href="javascript:void(0);">复制链接</a>去粘贴，或轻触浏览器自带<span class="ico_share_open"></span>图标即可分享到微信或朋友圈。</span>';
            } else if (browser.versions.android) {
                shareTxt = '<span class="share_to_text">请<a id="copyLink" href="javascript:void(0);">复制链接</a>去粘贴，或轻触浏览器自带<span class="ico_share_open_02"></span>图标即可分享到微信或朋友圈。</span>';
            }
            var footAddStr = '<div class="share_to_weixin"><div class="bd clear"><div class="share_to_left"><span class="ico_share_toweixin"></span><span class="ico_share_friend"></span></div>' + shareTxt + '</div></div>';
            var j_sharebox = new SliderFactory({
                id: 'shareBox',
                title: '分享',
                content: shareContent,
                hasFoot: false,
                footAdd: footAddStr,
                method: function () {
                    if (jQuery("#copyLink").length > 0) {
                        jQuery("#copyLink").click(function () {
                            jQuery("#copyTips").remove();
                            clearTimeout(hideTimer);
                            jQuery('<div id="copyTips" style="position:fixed;bottom:98px;left:50%;height:36px;margin-top:-18px;line-height:36px;background:rgba(50,50,50,.8);z-index:99;border-radius:5px;font-size:14px;color:#fff;text-align:center;padding:0 15px;z-index:1001;"><span>复制成功，快去分享给好友吧</span></div>').appendTo(jQuery("#shareBox"));
                            var oMarginL = -jQuery("#copyTips").outerWidth() / 2;
                            jQuery("#copyTips").css("margin-left", oMarginL + "px");
                            if (docinShareConfig != undefined) {
                                var shareTitle = '【' + docinShareConfig.title + '】\n';
                            }
                            copyToClipboard("#copyLink", shareTitle + window.location.href);
                            hideInSecond("copyTips", 3);
                            window.location.href = "weixin://";
                            inpmv(6645);
                            // var j_copySuccess = new SliderFactory({
                            // 	id:'copySuccess',
                            // 	title:'',
                            // 	content:'<p style="font-size:19px;"><span class="ico_copy_success"></span>复制成功</p><div style="margin:28px 0 0;"><a class="slider_btn btn_conform" href="weixin://">前往微信粘贴</a></div>',
                            // 	padding:'0 15px 20px',
                            // 	hasFoot:false,
                            // 	method:function(){
                            // 		j_sharebox.close();
                            // 		jQuery("#copySuccess").find(".btn_conform,.share_to_text a").click(function(){
                            // 			//copyToClipboard("#copyLink",shareTitle+window.location.href);
                            // 			inpmv(6647);
                            // 			window.location.href = "weixin://";
                            // 		});
                            // 	}
                            // });
                            inpmv(6646);
                        });
                    }
                    if (jQuery("#copy_cur_link").length > 0) {
                        jQuery("#copy_cur_link").click(function () {
                            jQuery("#copyTips").remove();
                            clearTimeout(hideTimer);
                            jQuery('<div id="copyTips" style="position:fixed;bottom:98px;left:50%;height:36px;margin-top:-18px;line-height:36px;background:rgba(50,50,50,.8);z-index:99;border-radius:5px;font-size:14px;color:#fff;text-align:center;padding:0 15px;z-index:1001;"><span>复制成功，快去分享给好友吧</span></div>').appendTo(jQuery("#shareBox"));
                            var oMarginL = -jQuery("#copyTips").outerWidth() / 2;
                            jQuery("#copyTips").css("margin-left", oMarginL + "px");
                            if (docinShareConfig != undefined) {
                                var shareTitle = '【' + docinShareConfig.title + '】\n';
                            }
                            copyToClipboard("#copy_cur_link", shareTitle + window.location.href);
                            hideInSecond("copyTips", 3);
                            inpmv(6645);
                            //window.location.href = "weixin://";
                        });
                    }
                    var nativeShare = new NativeShare();
                    var shareData = {
                        title: docinShareConfig.title,
                        desc: docinShareConfig.summary,
                        // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
                        link: window.location.href,
                        icon: docinShareConfig.pic,
                        // 不要过于依赖以下两个回调，很多浏览器是不支持的
                        success: function () {
                            console.log("success")
                        },
                        fail: function () {
                            console.log("fail")
                        }
                    }
                    nativeShare.setShareData(shareData);

                    function call(command) {
                        try {
                            nativeShare.call(command)
                        } catch (err) {
                            // 如果不支持，你可以在这里做降级处理
                            //alert(err.message)
                            // console.log("err.message")
                            console.log(11111);

                        }
                    }

                    if (jQuery("#qqshare").length > 0) {
                        jQuery("#qqshare").click(function () {
                            if (browser.versions.weixin) {
                                jQuery("#copy_cur_link").click();
                            } else {
                                jQuery("#copy_cur_link").click();
                                call('qqFriend');
                            }
                        });
                    }
                    if (jQuery("#qzoneshare").length > 0) {
                        jQuery("#qzoneshare").click(function () {
                            if (browser.versions.weixin) {
                                jQuery("#copy_cur_link").click();
                            } else {
                                call('qZone');
                            }
                        });
                    }

                }
            });
        }
    });
}

var browser = {
    versions: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;

        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信
            iosChrome: u.indexOf('CriOS') > -1, //是否ios chrome,
            androdChrome: u.indexOf('Chrome') > -1,
            uc: u.indexOf('UCBrowser') > -1, //是否UC
            baidu: u.indexOf('baidu') > -1, //是否百度
            huaweiDefaut: u.indexOf('HuaweiBrowser') > -1 //华为原生

        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

function SliderFactory(configs) {
    var _this = this;
    _this.options = {
        cls: '',
        id: '',
        title: '',
        content: '',
        padding: '',
        hasFoot: true,
        buttons: ['取消', "确定"],
        zIndex: '9999',
        onShow: null, //打开弹窗成功回调方法
        onOk: null,
        onCancel: null,
        onClose: null,
        footAdd: '',
        method: null //后绑定方法
    }
    c = _this.options;
    _this.config = jQuery.extend({}, c, configs);
    //console.log(_this.config);
    if (!(_this instanceof SliderFactory)) {
        return new SliderFactory(configs);
    }
    _this.init();
}

SliderFactory.prototype = {
    init: function () {
        var _this = this;
        var opt = _this.config;
        //if(jQuery("#"+opt.id).length == 1){return;}
        _this.createBody();
        _this.bindMethod();
        if (opt.onShow != null) {
            opt.onShow();
        }
        if (opt.method != null) {
            opt.method();
        }
        setTimeout(function () {
            jQuery("#" + opt.id).addClass("touch_slider_active");
        }, 200);
    },
    createBody: function () {
        var _this = this;
        var opt = _this.config;
        var iTitle = opt.title == "" ? "" : '<h4>' + opt.title + '</h4>';
        var iButton = "",
            iFootadd = "",
            iPadding = opt.padding ? 'padding:' + opt.padding : '';
        if (opt.buttons.length > 0) {
            if (opt.buttons.length == 1) { //只有一个按钮
                //	iButton = '<a class="slider_btn btn_cancel_01" href="javascript:void(0);">'+opt.buttons[0]+'</a>';
                iButton = '<a class="slider_btn btn_conform" href="javascript:void(0);">' + opt.buttons[0] + '</a>';
            } else if (opt.buttons.length == 2) {
                iButton = '<a class="slider_btn btn_cancel_01" href="javascript:void(0);">' + opt.buttons[0] + '</a><a class="slider_btn btn_conform" href="javascript:void(0);">' + opt.buttons[1] + '</a>';
            }
        }
        if (opt.footAdd != "") {
            iFootadd = '<div class="foot_add">' + opt.footAdd + '</div>'
        }
        var iFoot = opt.hasFoot ? '<div class="touch_slider_footer">' + iButton + '</div>' : '';
        var iBody = jQuery('<div id="' + opt.id + '" class="touch_slider_dialog ' + opt.cls + '"></div>');
        var iHtmlStr = '<div class="touch_slider_body">';
        iHtmlStr += '<span class="close_dialog"></span><div class="touch_slider_header">' + iTitle + '</div>';
        iHtmlStr += '<div class="touch_slider_content" style="' + iPadding + '">' + opt.content + '</div>' + iFoot + iFootadd + '</div><div class="dialog_mask"></div>';
        iBody.html(iHtmlStr);
        jQuery("body").append(iBody);
    },
    close: function () {
        var _this = this;
        var opt = _this.config;
        jQuery("#" + opt.id).removeClass("touch_slider_active");
        setTimeout(function () {
            jQuery("#" + opt.id).remove();
        }, 200);
        if (opt.onClose != null) {
            opt.onClose();
        }
    },
    bindMethod: function () {
        var _this = this;
        var opt = _this.config;
        jQuery("#" + opt.id).find(".close_dialog").click(function () {
            _this.close();
            return false;
        });
        jQuery("#" + opt.id).find(".dialog_mask").click(function () {
            _this.close();
            return false;
        });
        jQuery("#" + opt.id).find('.btn_cancel_01').click(function () {
            if (opt.onCancel != null) {
                opt.onCancel();
            }
            _this.close();
            return false;
        });
        jQuery("#" + opt.id + " .touch_slider_footer").find('.btn_conform').click(function () {
            if (opt.onOk != null) {
                opt.onOk();
            }
            _this.close();
            return false;
        });
    },
    method: function () {
        var _this = this;
        if (opt.method != null) {
            opt.method();
        }
    }
};

function isIOS9() {
    //获取固件版本
    var getOsv = function () {
        var reg = /OS ((\d+_?){2,3})\s/;
        if (navigator.userAgent.match(/iPad/i) || navigator.platform.match(/iPad/i) || navigator.userAgent.match(/iP(hone|od)/i) || navigator.platform.match(/iP(hone|od)/i)) {
            var osv = reg.exec(navigator.userAgent);
            if (osv.length > 0) {
                return osv[0].replace('OS', '').replace('os', '').replace(/\s+/g, '').replace(/_/g, '.');
            }
        }
        return '';
    };
    var osv = getOsv();
    var osvArr = osv.split('.');
    //初始化显示ios9引导
    if (osvArr && osvArr.length > 0) {
        if (parseInt(osvArr[0]) >= 9) {
            return true
        }
    }
    return false
}

function back() { //处理返回按钮没有后退页
    var backUrl = 'http://www.docin.com/touch_new/index.do';
    var flag = false;
    if (window.history.length > 1) {
        flag = true;
        history.back(-1);
    }
    if (flag == false) {
        window.location.href = backUrl;
    }
}

function is_weixin() { //判断是否是微信浏览器
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function payTip(iData, backUrl) {
    var j_confirm_pay = new Factory({
        id: "wxTip",
        content: '<p style="text-align:center;font-size:16px;padding:5px 0;">支付确认</p><p style="text-align:left;font-size:14px;padding:10px 0;">1.请在打开的页面进行支付.</p><p style="text-align:left;font-size:14px;padding:10px 0;">2.如支付完成,请点击“已完成支付”</p>',
        btn: ["取消", "已完成支付"],
        title: false,
        onOk: function () {
            //判断是否支付成功还是失败
            jQuery.ajax({
                url: "/touchPay/finResult.do",
                data: "val=" + iData,
                success: function (ret) {
                    if (ret == 0) {
                        location.reload();
                        window.location.href = backUrl;
                    } else {
                        jQuery('<div id="pay_fail" style="position:fixed;left:0;right:0;bottom:0;top:0;height: 60px;line-height: 60px;background:rgba(50,50,50,.8);z-index:99;border-radius:5px;font-size:14px;color:#fff;text-align:center;width:70%;margin: auto;">您尚未完成支付，请重新支付</div>').appendTo(jQuery(document.body));
                        setTimeout(function () {
                            jQuery("#pay_fail").remove();
                        }, 3000);
                    }
                }
            });
        }
    });
}

function notWeixinPayTip(config, buyWay) { //微信外浏览器提示
    if (jQuery("#purchaseModel").length > 0) {
        jQuery("#purchaseModel").remove();
    }
    var j_confirm_pay = new Factory({
        id: "nowxTip",
        content: '<p style="text-align:center;font-size:16px;padding:5px 0;">支付确认</p><p style="text-align:left;font-size:14px;padding:10px 0;">1.请在打开的页面进行支付.</p><p style="text-align:left;font-size:14px;padding:10px 0;">2.如支付完成,请点击“已完成支付”</p>',
        btn: ["取消", "已完成支付"],
        title: false,
        onOk: function () {
            if (buyWay == 3) {
                jQuery.ajax({
                    url: "/touchPay/resultNotify_v2.do",
                    data: "pid=" + config.pid + "&pageRecord=" + config.recordPage,
                    success: function (re) {
                        var reData = JSON.parse(re);
                        if (reData.status == 1) {
                            location.reload();

                            window.location.href = reData.errmsg;

                        } else {
                            jQuery("*[data-handel='download']").eq(0).trigger("touchend");
                        }
                    }
                });
            } else if (buyWay == 2) {
                //判断是否支付成功还是失败
                jQuery.ajax({
                    url: "/touchPay/resultNotify.do",
                    data: "pid=" + config.pid + "&dealFlag=" + dealFlag,
                    success: function (re) {
                        if (re == 1) {
                            location.reload();
                        } else if (re == -1) {
                            alert("支付失败");
                        }
                    }
                });
            }
        }
    });
}

function weixinExpTips(config, buyWay) { //buyWay 2付费  3下载
    if (typeof (config) == "undefined") {
        return;
    }
    if (jQuery("#purchaseModel").length == 1) {
        jQuery("#purchaseModel").hide();
    }
    var j_confirm_pay = new Factory({
        id: "wxPop",
        content: '<p style="text-align:center;font-size:16px;padding:5px 0;">支付确认</p><p style="text-align:left;font-size:14px;padding:10px 0;">1、请在微信内完成支付，如果您已支付成功，请点击"已完成支付"按钮。</p><p style="text-align:left;font-size:14px;padding:10px 0;">2、如果您还未安装微信6.0.2及以上版本客户端，请先安装微信或使用电脑访问豆丁网进行充值支付。</p>',
        btn: ["取消", "已完成支付"],
        title: false,
        onOk: function () {
            //判断是否支付成功还是失败
            if (buyWay == 3) {
                jQuery.ajax({
                    url: "/touchPay/resultNotify_v2.do",
                    data: "pid=" + config.pid + "&pageRecord=" + config.recordPage,
                    success: function (re) {
                        var reData = JSON.parse(re);
                        if (reData.status == 1) {
                            location.reload();

                            window.location.href = reData.errmsg;

                        } else {
                            jQuery('<div id="pay_fail" style="position:fixed;left:0;right:0;bottom:0;top:0;height: 60px;line-height: 60px;background:rgba(50,50,50,.8);z-index:99;border-radius:5px;font-size:14px;color:#fff;text-align:center;width:70%;margin: auto;">您尚未完成支付，请重新支付</div>').appendTo(jQuery(document.body));
                            setTimeout(function () {
                                jQuery("#pay_fail").remove();
                                jQuery("*[data-handel='download']").eq(0).trigger("touchend");
                            }, 3000);

                        }
                    }
                });
            } else if (buyWay == 2) {
                //判断是否支付成功还是失败
                jQuery.ajax({
                    url: "/touchPay/resultNotify.do",
                    data: "pid=" + config.pid + "&dealFlag=" + dealFlag,
                    success: function (re) {
                        if (re == 1) {
                            location.reload();
                        } else if (re == -1) {
                            jQuery('<div id="pay_fail" style="position:fixed;left:0;right:0;bottom:0;top:0;height: 60px;line-height: 60px;background:rgba(50,50,50,.8);z-index:99;border-radius:5px;font-size:14px;color:#fff;text-align:center;width:70%;margin: auto;">您尚未完成支付，请重新支付</div>').appendTo(jQuery(document.body));
                            setTimeout(function () {
                                jQuery("#pay_fail").remove();
                            }, 3000);
                        }
                    }
                });
            }

        }
    });
}

function yuezuHandel(config, iData1) { //余额足买完回调
    if (iData1.status == 17) { //免费下载之前验证（易盾）
        var captchaIns;
        var showOrder = iData1.errmsg;
        showDownLoadSign(1, config, showOrder);
    } else if (iData1.status == 18) { //免费下载之前验证（豆丁）
        var showOrder = iData1.errmsg;
        showDownLoadSign(2, config, showOrder);
    } else if (iData1.status == -1) {
        jQuery('<div id="buyTips" class="waitingShow"><span>支付失败，请重新购买</span></div>').appendTo(jQuery(document.body));
        setWaitingShow();
        hideInSecond("buyTips", 2);
    } else if (iData1.status == 1) { //  不用验证码,直接下载(5次之前或者机构)
        jQuery('<div id="buyTips" class="waitingShow"><span>购买成功</span></div>').appendTo(jQuery(document.body));
        setWaitingShow();
        hideInSecond("buyTips", 2);
        localStoreToApp(iData1, deviceType);
        // if (typeof (deviceType) != "undefined" && deviceType == 2) {
        // 	localStoreToApp(iData1,deviceType);
        // }
        // else {
        // 	window.location.href = iData1.errmsg;
        // }
    }
}

function showDownLoadSign(f, config, showOrder) {
    var showOrder = showOrder;
    if (f == 1) { //1:yidun  2:docin
        var deviceWidth = window.screen.width,
            signInitWidth = '310px';
        if (deviceWidth <= 320) {
            signInitWidth = '250px';
            signInitHeight = '180px';
        } else if (deviceWidth <= 360 && deviceWidth > 320) {
            signInitWidth = '280px';
            signInitHeight = '195px';
        } else if (deviceWidth > 360 && deviceWidth <= 375) {
            signInitWidth = '310px';
            signInitHeight = '210px';
        } else {
            signInitWidth = '320px';
            signInitHeight = '215px';
        }
        var captchaIns;
        var downLoadSign = new Factory({
            id: 'j_downloadSign',
            content: '<div style="font-size:14px;"><a class="doc-qq" style="float:right;color:#d0d0d0;text-decoration:underline;" href="javascript:void(0);" ontouchend="inpmv(6539);">联系在线客服</a>滑动拼图完成验证</div><div style="margin:10px auto;height:' + signInitHeight + ';" id="captcha_div"></div><div id="j_savedoc" style="margin-top:15px;"><span class="ico_button btnc_gray2" style="display:block;">保存文档</span></div>',
            title: showOrder,
            bottom: false,
            shadow: 1,
            iClose: 1,
            onClose: function () {
                // if (rechargeConfig != undefined) {
                // 	if (rechargeConfig.pageCount != rechargeConfig.previewPage) { //购买付费阅读刷页面
                // 		location.reload();
                // 	}
                // }
            },
            bindMethod: function () {
                jQuery('<p style="color:#ccc;font-size:14px;height:200px;line-height:180px;text-align:center;">正在初始化...</p>').appendTo(jQuery("#captcha_div"));
                LoadJS("//cstaticdun.126.net/load.min.js", false, function () {
                    initNECaptcha({
                        captchaId: 'eea22b6ea5f84c1c84d6a14bc5e16d03',
                        element: '#captcha_div',
                        mode: 'embed',
                        width: signInitWidth,
                        onReady: function () {
                            //downLoadSign.setPos();
                        },
                        onVerify: function (err, data) {
                            if (err) return;
                            jQuery("#j_savedoc span").html("正在保存");
                            jQuery("#j_savedoc span").removeClass("btnc_gray2").addClass("btnc_blue1");
                            jQuery.ajax({
                                type: 'GET',
                                url: "/newEnd/codeIsRight.do",
                                data: "pid=" + config.pid + "&code=" + data.validate + "&from=touch",
                                success: function (idata) {
                                    if (idata != "-1") {
                                        var newData = {
                                            'errmsg': idata
                                        };
                                        localStoreToApp(newData, deviceType);
                                        jQuery("#j_downloadSign").remove();
                                        //downLoadSign.close();
                                        //jQuery("*[data-handel='download']").eq(0).trigger("touchend");//立即下载
                                    } else {
                                        captchaIns.refresh();
                                        jQuery("#j_savedoc span").html("保存文档");
                                        jQuery("#j_savedoc span").removeClass("btnc_blue1").addClass("btnc_gray2");
                                    }
                                }
                            });
                        }
                    }, function onload(instance) {
                        captchaIns = instance;
                    }, function onerror(err) {
                    });
                });
                qqkefuCopyData();
            },
            onOk: function () {

            }
        });
    } else if (f == 2) {
        var downLoadSign = new Factory({
            id: 'j_downloadSign',
            content: '<div style="font-size:12px;"><a id="contactQQ" style="float:right;color:#d0d0d0;text-decoration:underline;" href="javascript:void(0);" ontouchend="inpmv(6539);">联系在线客服</a>输入验证码</div><div class="downloadLimitCode" style="margin: 15px auto;min-height:60px;"><input type="email" class="yzm_input" style="width:130px;height:32px;border:1px solid #d5d5d5;padding-left:10px;" id="downloadCode" name="downloadCode" style="border:1px solid #d5d5d5;"><img height="32" id="downloadimg" name="downloadimg" style="vertical-align:middle;margin:0 5px;" src="/servlet/getctime?from=downcodenew&pid=' + config.pid + '" alt="" title="请输入图片中的字符" /><a id="changeCode" style="font-size:12px;" title="换张图片" href="javascript:void(0);">换张图</a><div id="signErrorTips" style="color:#ff0000;padding-top:5px;font-size:12px;height:20px;"></div></div><div id="j_savedoc" style="margin-top:15px;"><span class="ico_button btnc_gray2" style="display:block;">保存文档</span></div>',
            title: showOrder,
            bottom: false,
            shadow: 1,
            iClose: 1,
            onClose: function () {
                // if (rechargeConfig != undefined) {
                // 	if (rechargeConfig.pageCount != rechargeConfig.previewPage) { //购买付费阅读刷页面
                // 		location.reload();
                // 	}
                // }
            },
            bindMethod: function () {
                var oDownLoadCodeInput = jQuery("#downloadCode");
                if (oDownLoadCodeInput.length == 0) {
                    return;
                }
                oDownLoadCodeInput.focus();
                refreshDownloadCode();
                jQuery("#changeCode,#downloadimg").click(function () {
                    refreshDownloadCode();
                });
                oDownLoadCodeInput.on("keydown", function (event) {
                    if (event.keyCode == 13) {
                        jQuery("#j_savedoc span").click();
                        event.preventDefault();
                    }
                });

                function refreshDownloadCode() {
                    var oDownloadCodeImg = jQuery('#downloadimg');
                    if (oDownloadCodeImg.length > 0) {
                        oDownloadCodeImg.attr('src', '/servlet/getctime?from=downcodenew&pid=' + config.pid + '&t=' + new Date().getTime());
                    }
                }

                oDownLoadCodeInput.on("input propertychange", function () {
                    if (oDownLoadCodeInput.val() != "" && !jQuery("#j_savedoc span").hasClass("btnc_blue1")) {
                        jQuery("#j_savedoc span").removeClass("btnc_gray2").addClass("btnc_blue");
                    } else if (oDownLoadCodeInput.val() == "") {
                        jQuery("#j_savedoc span").removeClass("btnc_blue").addClass("btnc_gray2");
                    }
                });
                jQuery("#j_savedoc").on("click", '.btnc_blue', function () {
                    oDownLoadCodeInput.bind("focus", function () {
                        jQuery('#signErrorTips').html("");
                    });
                    var yzmValue = oDownLoadCodeInput.val();
                    if (yzmValue == "") {
                        jQuery('#signErrorTips').html("验证码错误，请重新输入");
                        refreshDownloadCode();
                        return false;
                    }
                    jQuery.ajax({
                        type: 'GET',
                        url: "/newEnd/codeIsRight.do",
                        async: false,
                        data: "pid=" + config.pid + "&code=" + yzmValue,
                        success: function (idata) {
                            if (idata != "-1") {
                                var newData = {
                                    'errmsg': idata
                                };
                                localStoreToApp(newData, deviceType);
                                jQuery("#j_downloadSign").remove();
                            } else {
                                jQuery('#signErrorTips').html("验证码错误，请重新输入");
                                oDownLoadCodeInput.val("");
                                jQuery("#j_savedoc span").removeClass("btnc_blue").addClass("btnc_gray2");
                                refreshDownloadCode();
                            }
                        }
                    });
                });
                qqkefuCopyData();
            },
            onOk: function () {

            }
        });
    }
}

function localStoreToApp(iData, deviceType) {
    var iButtonStr = "",
        iVipFlag = "",
        // 判断是否是新用户
        ifNewUser = rechargeConfig.isNewUser == 1 ? '<p class="newUserTips">亲，以后就用您的微信<a class="loginSpan" href="">登录豆丁</a>噢</p>' : '';
    if (deviceType == 1) {
        iButtonStr = "保存至本地存储"; //安卓
    } else if (deviceType == 2) {
        iButtonStr = "保存至其它应用存储"; //ios
    }
    if (typeof (rechargeConfig) != "undefined") {

        if (rechargeConfig.isBuildProduct == false) {
            iVipFlag = picture_image_path_v1 + "/images_cn/iphone/collect/ico_end_vip.png"
        } else {
            iVipFlag = picture_image_path_v1 + "/images_cn/iphone/collect/ico_end_huiyuan.png"
        }

    }

    var j_download_save = new SliderFactory({
        id: 'j_download_save',
        title: '将文档保存到哪儿？',
        content: ifNewUser + '<p class="save_file_btns" style="font-size:16px;line-height:24px;color:#333;"><a id="downLoadApp" class="saveApp" href="javascript:void(0);">用APP立即保存</a><a style="position:relative;" class="sendEamil" href="javascript:void(0);">发送到邮箱<em style="position:absolute;top:12px;margin-left:4px;width:19px;height:12px;background:url(' + iVipFlag + ') 0 0 no-repeat;background-size:19px 12px;"></em></a></p>',
        buttons: [iButtonStr],
        footAdd: '',
        hasFoot: true,
        padding: "20px 15px 10px",
        onClose: function () {
            // if (rechargeConfig != undefined) {
            // 	if (rechargeConfig.pageCount != rechargeConfig.previewPage) { //购买付费阅读刷页面
            // 		location.reload();
            // 	}
            // }
        },
        onOk: function () {
            j_download_save.close();
            window.location.href = iData.errmsg;
        },
        method: function () {
            openAppMethod("j_download_save", iData.errmsg);
            if (jQuery("#j_download_save .sendEamil").length == 1) {
                jQuery("#j_download_save .sendEamil").bind("click", function () {
                    if (typeof (rechargeConfig) != "undefined") {
                        if (rechargeConfig.isVip == "false" || rechargeConfig.isVip == undefined) { //不是会员，引导购买会员
                            if (rechargeConfig.isBuildProduct == false) {
                                sendEmailCheck(1);
                            } else {
                                sendEmailCheck(2);
                            }
                        } else {
                            jQuery.ajax({
                                url: "/app/touchPay2/getUserEmailAdress",
                                data: 'pid=' + rechargeConfig.pid,
                                success: function (re) {
                                    var reJson = re;
                                    var iSize = reJson.size;
                                    //alert(reJson.type);
                                    if (reJson.type == 1) {
                                        if (iSize > 50 * 1024) { //超出大小
                                            sendEmailCheck(4);
                                        } else {
                                            var iEmail = reJson.addr;
                                            j_download_save.close();
                                            sendEmailLayout(iEmail);
                                        }
                                    } else if (reJson.type == -3) { //发送此文档大于5次
                                        sendEmailCheck(6);
                                    } else if (reJson.type == -4) { //每日限额20次超出
                                        sendEmailCheck(5);
                                    } else if (reJson.type == -5) { //土木文档
                                        sendEmailCheck(7);
                                    }

                                }
                            });
                        }
                    }
                    inpmv(6754);
                    return false;
                });
            }
            if (jQuery("#j_browser_guide").length == 1) {
                jQuery("#j_browser_guide").on("click", function () {
                    saveDocinGuide();
                    return false;
                });
            }
            inpv_new_v2(627);
        },
        footAdd: '<p style="color:#666;font-size:12px;padding-bottom:14px;">如何保存到其它应用？<a id="j_browser_guide" style="color:#666;text-decoration:underline;" href="javascript:void(0);">查看帮助</a></p>'
    });
}

function saveDocinGuide() {
    stopMove();
    jQuery('<div class="guide_browser_layout"></div>').appendTo(jQuery(document.body));
    if (browser.versions.ios) {
        if (browser.versions.iosChrome) {
            jQuery(".guide_browser_layout").addClass("guide_ios_chrome");
        } else if (browser.versions.uc) {
            jQuery(".guide_browser_layout").addClass("guide_ios_uc");
        } else if (browser.versions.baidu) {
            jQuery(".guide_browser_layout").addClass("guide_ios_baidu");
        } else if (browser.versions.weixin) {
            jQuery(".guide_browser_layout").addClass("guide_weixin_ios");
        } else {
            jQuery(".guide_browser_layout").addClass("guide_ios_safari");
        }
    } else if (browser.versions.android) {
        if (browser.versions.uc) {
            jQuery(".guide_browser_layout").addClass("guide_andro_uc");
        } else if (browser.versions.weixin) {
            jQuery(".guide_browser_layout").addClass("guide_weixin_andro");
        } else if (browser.versions.baidu) {
            jQuery(".guide_browser_layout").addClass("guide_andro_baidu");
        } else if (browser.versions.huaweiDefaut) {
            jQuery(".guide_browser_layout").addClass("guide_andro_default");
        } else if (browser.versions.androdChrome) {
            jQuery(".guide_browser_layout").addClass("guide_andro_chrome");
        } else {
            jQuery(".guide_browser_layout").addClass("guide_andro_default");
        }

    }
    jQuery(".guide_browser_layout").on("click", function () {
        jQuery(".guide_browser_layout").remove();
        startmove();
        return false;
    });

}

function sendEmailLayout(emailAddr) {

    var temp = jQuery("#j_sendEmailLayout")
    if (typeof (temp) != 'undefined' && temp.length != 0) return;

    var j_sendEmailLayout = new SliderFactory({
        id: 'j_sendEmailLayout',
        title: '发送到哪一个邮箱？',
        content: '<div style="height:44px;line-height:44px;border:1px solid #333;border-radius:3px;text-align:left;"><div style="position:relative;"><label style="position:absolute;left:15px;top:0;color:#666;font-size:15px;">收件人：</label><input id="emailAddr" style="height:44px;width:100%;padding-left:75px;box-sizing:border-box;font-size:16px;color:#000;" placeholder="例如xx@xxx.com" type="email"/></div></div><p id="mailTips" style="font-size:13px;color:#999;text-align:left;margin-top:9px;">文档将以附件形式发送到该邮箱</p><div class="downloadLimitCode" style="margin:15px auto 0;min-height:60px;text-align:left;display:none;"><input type="email" class="yzm_input" style="width:130px;height:32px;border:1px solid #333;padding-left:10px;height:44px;border-radius:3px;" id="downloadCode" name="downloadCode" style="border:1px solid #d5d5d5;"><img height="32" id="downloadimg" name="downloadimg" style="vertical-align:middle;margin:0 5px;" src="/servlet/getctime?from=sendproduct&pid=' + rechargeConfig.pid + '" alt="" title="请输入图片中的字符" /><a id="changeCode" style="font-size:12px;" title="换张图片" href="javascript:void(0);">换张图</a><div id="signErrorTips" style="color:#999;padding-top:5px;font-size:12px;height:20px;">请输入图片中的字符</div></div><div style="padding-top:24px;"><a id="emailSendBtn" class="slider_btn btn_conform" href="javascript:void(0);">发送</a></div>',
        buttons: [],
        footAdd: '',
        hasFoot: false,
        padding: "20px 15px 10px",
        method: function () {
            LoadJS(picture_image_path_v1 + '/js/jquery.mailAutoComplete-4.0.js?rand=20190917', false, function () {
                jQuery("#emailAddr").mailAutoComplete();
            });
            jQuery("#emailAddr").val(jQuery.trim(emailAddr));
            jQuery("#emailAddr,#downloadCode").bind("focus", function () {
                jQuery("#j_sendEmailLayout .touch_slider_body").css({
                    'position': 'absolute',
                    'top': 0,
                    'bottom': 'auto'
                });
                jQuery("html,body").animate({
                    "scrollTop": (0 + "px")
                }, "fast");
            });
            jQuery("#emailAddr,#downloadCode").bind("keydown", function (event) {
                if (event.keyCode == 13) {
                    jQuery("#emailSendBtn").click();
                }
            });
            jQuery("#emailAddr").bind("input propertychange", function (event) {
                if (jQuery("#mailTips").children("span").length == 1) {
                    jQuery("#mailTips").html("文档将以附件形式发送到该邮箱");
                }
            });
            jQuery("#downloadCode").bind("input propertychange", function (event) {
                if (jQuery("#signErrorTips").children("span").length == 1) {
                    jQuery("#signErrorTips").html("请输入图片中的字符");
                }
            });
            jQuery("#emailSendBtn").bind("click", function () {
                var iEmail = jQuery("#emailAddr").val();
                checkSendEmail(iEmail);
                return false;
            });
        }
    });
}

function splitEmail(email) {
    var arr = email.split("@");
    console.log(arr);
    var star = "";
    if (arr[0].length > 10) {
        star = "...";
        arr[0] = arr[0].substr(0, arr[0].length - 10) + star;
    }
    return email = arr[0] + "@" + arr[1];
}

function checkSendEmail(email) {


    var iEmail = email;
    var errorTip = "";
    var yzCode = "";
    if (iEmail == "") {
        jQuery("#emailAddr").focus();
        errorTip = "请您输入邮箱";
        jQuery("#mailTips").html('<span style="color:#ff0000;">' + errorTip + '</span>');
        return false;
    } else if (!checkEmail(iEmail)) {
        jQuery("#emailAddr").focus();
        errorTip = "邮箱格式错误，请重新填写";
        jQuery("#mailTips").html('<span style="color:#ff0000;">' + errorTip + '</span>');
        return false;
    } else if (jQuery(".downloadLimitCode").is(":visible")) {
        yzCode = jQuery("#downloadCode").val();
        if (yzCode == "") {
            jQuery('#signErrorTips').html('<span style="color:#ff0000;">验证码错误，请重新输入</span>');
        }
    }
    jQuery("#emailSendBtn").addClass("sendLoading").html("正在发送");
    jQuery("#mailTips").html('文档将以附件形式发送到该邮箱');
    var tempEmail = splitEmail(iEmail);

    jQuery.ajax({
        url: "/app/touchPay2/sendProduct",
        data: "pid=" + rechargeConfig.pid + "&email=" + iEmail + "&code=" + yzCode,
        success: function (re) {

            if (re == 1) { //成功
                jQuery("#j_sendEmailLayout").remove();
                sendEmailSuccess(tempEmail);
                inpmv(6755);
            } else if (re == -2) { //文档大小超出限额
                sendEmailCheck(4);
                jQuery("#emailSendBtn").removeClass("sendLoading").html("发送");
            } else if (re == -3 || re == -4 || re == -5 || re == -6 || re == -7) {
                alert("请求异常！");
                jQuery("#emailSendBtn").removeClass("sendLoading").html("发送");
            } else if (re == -9) { //超出今日限额
                jQuery("#emailSendBtn").removeClass("sendLoading").html("发送");
                jQuery("#mailTips").html('<span style="color:#ff0000;">抱歉，超过每日发送限制，请明日再试。</span>');
            } else if (re == -8) { //发送此文档大于5次，不允许发送了
                jQuery("#emailSendBtn").removeClass("sendLoading").html("发送");
                jQuery("#mailTips").html('<span style="color:#ff0000;">抱歉，超过每日发送限制，请明日再试。</span>');
            } else if (re == -2) { //文档大小超出限额
                jQuery("#emailSendBtn").removeClass("sendLoading").html("发送");
                jQuery("#mailTips").html('<span style="color:#ff0000;">抱歉，此文档大小超出限制，暂无法发送到邮箱。</span>');
            } else if (re == 100) { //多次之后发送之前需要验证
                jQuery("#emailSendBtn").removeClass("sendLoading").html("发送");
                jQuery(".downloadLimitCode").show();
                jQuery("#downloadCode").focus();
                refreshSendEmailCode();
                jQuery("#changeCode,#downloadimg").click(function () {
                    refreshSendEmailCode();
                });
            } else if (re == 101) { //验证码错误
                jQuery("#downloadCode").focus();
                jQuery("#emailSendBtn").removeClass("sendLoading").html("发送");
                jQuery('#signErrorTips').html('<span style="color:#ff0000;">验证码错误，请重新输入</span>');
                refreshSendEmailCode();
            }

        }
    });
}

function refreshSendEmailCode() {
    var oDownloadCodeImg = jQuery('#downloadimg');
    if (oDownloadCodeImg.length > 0) {
        oDownloadCodeImg.attr('src', '/servlet/getctime?from=sendproduct&pid=' + rechargeConfig.pid + '&t=' + new Date().getTime());
    }
}

function sendEmailSuccess(email) {
    var j_download_save = new SliderFactory({
        id: 'j_send_success',
        title: '<div style="font-size:18px;margin:30px 0 5px;"><i class="ico_copy_success"></i>文档已成功发送至：</div><div style="font-size:16px;color:#666;">邮箱：<span style="color:#000;">' + email + '</span></div></span>',
        content: '<div style="text-align:left;font-size:13px;line-height:22px;color:#666;"><dl class="send_mail_failed"><dt style="font-size:14px;margin-bottom:5px;">若长时间未收到邮件的处理方法：</dt><dd>检查邮箱是否设置了邮件拦截，如拦截请将service@docin.org添加到白名单</dd><dd>请在邮箱的广告/垃圾邮件中进行查询</dd><dd>更换邮箱地址，重新发送文档</dd></dl></div>',
        buttons: ["我知道了"],
        footAdd: '',
        hasFoot: true,
        padding: "20px 15px 10px",
        onOk: function () {
        },
        method: function () {

        },
        footAdd: ''
    });
}

function openVipGuideTip(f, type) { //type:类型，adv是关闭广告
    var iBigTitle = ["开通VIP，即享该功能", "开通建筑会员，即享该功能"];
    var iTitle1 = ["每天能下百篇免费文档，VIP还享", "除了阅读页去广告，VIP还享", "除了发送到邮箱，VIP还享"];
    var iTitle2 = ["每天能下百篇免费文档，会员还享", "除了阅读页去广告，会员还享", "除了发送到邮箱，会员还享"];
    var iBtnStr = ["开通VIP", "开通建筑会员"];
    var iContentStr = '<p style="font-size:18px;color:#000;padding-bottom:18px;">' + iTitle1[f] + '</p>';
    ;
    var iSub = 0;
    var iLi = "";


    var iUrl = '/touchPay/touch_vip.do?vip_from=touch_send_email&pid=' + rechargeConfig.pid;
    var iTequan = ['<li><span class="vip_down"></span><div class="t1">下载免费文档<br/>100篇/天</div></li>', '<li><span class="no_ad"></span><div class="t1">阅读文档<br/>无广告</div></li>', '<li><span class="vip_sendemail"></span><div class="t1">文档发送<br/>到邮箱</div></li>'];
    if (typeof (rechargeConfig) != "undefined" && rechargeConfig.isBuildProduct == true) {

        var vip_from = "touch_send_email_build";
        if (typeof type != 'undefined') {
            vip_from = type;
        }

        iSub = 1;
        iUrl = '/jsp_cn/touch/build/build_vip_new.jsp?vip_from=' + vip_from + '&pid=' + rechargeConfig.pid;
        iLi = '<li><span class="vip_yhq"></span><div class="t1">赠收费文档<br/>下载券*</div></li>';
        iContentStr = '<p style="font-size:18px;color:#000;padding-bottom:18px;">' + iTitle2[f] + '</p>';
    }
    if (f == 0) {
        iLi += iTequan[1] + iTequan[2];
    } else if (f == 1) {
        iLi += iTequan[0] + iTequan[2];
    } else if (f == 2) {
        iLi += iTequan[0] + iTequan[1];
    }
    iContentStr += '<ul class="openvip_qx_list clear">' + iLi + '<li><span class="vip_service"></span><div class="t1">专属客服</div></li></ul>'
    var j_openviptips = new SliderFactory({
        id: 'j_openvip_tip',
        title: iBigTitle[iSub],
        content: iContentStr,
        buttons: [iBtnStr[iSub]],
        hasFoot: true,
        padding: "20px 15px 10px",
        onClose: function () {
            if (typeof (rechargeConfig) != "undefined" && rechargeConfig.isBuildProduct == true) {
                inpmv(6923); //建筑会员关闭
            } else {
                inpmv(6920); //普通会员开通关闭
            }
        },
        onOk: function () {
            if (typeof (rechargeConfig) != "undefined" && rechargeConfig.isBuildProduct == true) {
                inpmv(6924); //建筑会员开通vip点击统计
            } else {
                inpmv(6921); //普通会员开通vip点击统计
            }
            location.href = iUrl;
            //j_openviptips.close();
        },
        method: function () {

        }
    });
    if (typeof (rechargeConfig) != "undefined" && rechargeConfig.isBuildProduct == true) {
        inpmv(6922); //建筑会员开通vip载入数
    } else {
        inpmv(6919); //普通会员开通vip载入数
    }

}

function sendEmailCheck(f) { //f:1 引导开通VIP 2:引导开通建筑VIP 3：引导开通PLUS会员 4：超出大小
    var str = "",
        iUrl = "",
        btnStr = "";
    if (f == 1 || f == 2) {
        //str = "VIP";
        //iUrl = '/touchPay/touch_vip.do?vip_from=touch_send_email&pid=' + rechargeConfig.pid;
        openVipGuideTip(2);
        return false;
    }
    // } else if (f == 2) {
    // 	str = "建筑会员";
    // 	iUrl = '/jsp_cn/touch/build/build_vip.jsp?vip_from=touch_send_email_build&pid=' + rechargeConfig.pid;
    // } else if (f == 3) {
    // 	str = "PLUS会员";
    // }
    btnStr = "立即开通" + str;
    str = '抱歉，发送邮箱功能仅为"' + str + '"特权，您尚未开通此功能。';
    if (f == 4) {
        str = "抱歉，此文档大小超出限制，暂无法发送到邮箱。";
        btnStr = "更换其他保存文件方式";
    } else if (f == 5) {
        str = "抱歉，超过每日发送限制，请明日再试";
        btnStr = "更换其他保存文件方式";
    } else if (f == 6) {
        str = "抱歉，该文档超过每日发送限制，请明日再试";
        btnStr = "更换其他保存文件方式";
    } else if (f == 7) { //土木
        str = "文档受限，暂无法发送到邮箱";
        btnStr = "确定";
    }
    var j_sendEmailTips = new Factory({
        id: "sendEmailTips",
        title: false,
        content: '<p style="font-size:15px;line-height:22px;text-align:left;padding-top:15px;">' + str + '</p>',
        btn: btnStr,
        btnRole: 1,
        iClose: 1,
        onOk: function () {
            if (f == 1 || f == 2) {
                location.href = iUrl;
            } else {
                j_sendEmailTips.close();
            }

        }
    });
}

function localStoreToApp_old(iData, deviceType) {
    var openStr1 = deviceType == 1 ? '<a id="localDown" style="display:block;" href="javascript:void(0);">保存至本地存储..</a>' : '<a id="localDown" style="display:block;" href="javascript:void(0);">导出至其它应用..</a>';
    var j_to_app = new Factory({
        id: 'j_toapp',
        content: '<p id="downLoadApp" style="font-size:16px;padding:5px 0;font-size:18px;color:#4889f1;margin-bottom:15px;"><img style="width:45px;margin:0 15px 0 10px;vertical-align:middle;" src="' + picture_image_path_v1 + '/images_cn/ico_app_bookshop83x83.png" alt="" />下载到豆丁书房</p><p style="height:46px;line-height:46px;border-top:1px solid #ccc;">' + openStr1 + '</p>',
        bottom: false,
        title: false,
        iClose: 1,
        padding: "20px 20px 0",
        onClose: function () {
            if (rechargeConfig != undefined) {
                if (rechargeConfig.pageCount != rechargeConfig.previewPage) { //购买付费阅读刷页面
                    location.reload();
                }
            }
        },
        bindMethod: function () {
            openAppMethod("j_toapp", iData.errmsg);
            jQuery("#localDown").on("click", function () {
                j_to_app.close();
                window.location.href = iData.errmsg;
                return false;
            });
            setTimeout(function () {
                j_to_app.setPos();
            }, 200);
        }
    });

}

function downloadBtnHandel(config) { //立即下载文档

    if (typeof (config) == "undefined") {
        return;
    }
    jQuery(document).on("touchend", "*[data-handel='download']", function (ev) {
        ev.stopPropagation();
        if (jQuery('.downLoadTipInfo .close_tips').length == 1) {
            jQuery('.downLoadTipInfo .close_tips').click();
        }
        jQuery.ajax({
            type: 'POST',
            async: false,
            url: "/touchPay/beforeBuy_v2.do",
            data: "pid=" + config.pid + "&dealFlag=2",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                jQuery('<div id="buyTips" class="waitingShow"><span>服务器忙，请重试</span></div>').appendTo(jQuery(document.body));
                setWaitingShow();
            },
            success: function (data) {
                //-1异常；1购买过；2余额不足  3：余额足够 0:未登录
                //{"data":{"need_money":3.978,"p_price":3.98,"userBalance":0.002},"errmsg":"success","status":2}
                if (jQuery("#buyTips").length > 0) {
                    jQuery("#buyTips").remove();
                }
                var iData = JSON.parse(data);
                if (iData.status == 14) {
                    window.open("/app/errorMessage?message=664");
                    return;
                } else if (iData.status == 17) { //免费下载之前验证（易盾）
                    var captchaIns;
                    var showOrder = iData.errmsg;
                    showDownLoadSign(1, config, showOrder);
                } else if (iData.status == 18) { //免费下载之前验证（豆丁）
                    var showOrder = iData.errmsg;
                    showDownLoadSign(2, config, showOrder);
                } else if (iData.status == 16) { //余额不足 样式2
                    if (iData.ifbj == false) {
                        nobalancehandel(iData, config, 3);
                    } else {
                        var j_recharge = new Factory({
                            id: "moneyPop",
                            content: '<p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.user_price + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：<span style="color:#ff0000;">' + iData.p_price_str + '</span></p><p style="font-size:14px;line-height:24px;">您的余额不足，<b>请通过以下途径获取豆元：</b></p></br><input id="curMoney" type="hidden" value="' + iData.need_money + '">',
                            btn: "我知道了",
                            btnRole: 1,
                            title: false,
                            padding: "10px 15px",
                            onOk: function () {
                                j_recharge.close();
                            }
                        });
                    }
                } else if (iData.buildProduct == false) {
                    if (iData.status == 2) { //余额不足请充值
                        inpmv(5973);
                        if (iData.ifbj) {
                            if (config.uploaderId == "146165196") {
                                var j_recharge = new Factory({
                                    id: 'moneyPop',
                                    content: '<p style="text-align:center;font-size:16px;padding:5px 0;font-weight:bold;">您正在购买</p><p style="text-align:left;font-size:14px;padding:8px 0;">名称：考研文档</p><p style="text-align:left;font-size:14px;padding:2px 0;">您的账户可支付充值豆元：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="text-align:left;font-size:14px;padding:2px 0;">您的余额不足，还需充值：<span style="color:#ff0000;">' + iData.data.need_money_str + '</span></p>',
                                    btn: ["取消", "充值并购买"],
                                    title: false,
                                    onOk: function () {
                                        window.location.href = "/jsp_cn/touchPay/dispatchReq.jsp?d=touchEnd&pid=" + config.pid + "&amount=" + iData.data.need_money_str + "&pageRecord=" + config.recordPage + "&dealFlag=2";
                                    }
                                });
                            } else {
                                var j_recharge = new Factory({
                                    id: "moneyPop",
                                    content: '<p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span></p><p style="font-size:14px;line-height:24px;">您的余额不足，<b>请通过以下途径获取豆元：</b></p></br><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '"><ul style="margin-left: 20px;font-size:14px;"><li style="list-style-type:disc;">在PC端网页<b>上传文档</b></li><li style="list-style-type:disc;">您上传的文档被浏览或被下载</li><li style="list-style-type:disc;">在PC端网页参与完成<b>豆丁任务</b></li></ul></br>',
                                    btn: "我知道了",
                                    btnRole: 1,
                                    title: false,
                                    padding: "10px 15px",
                                    onOk: function () {
                                        j_recharge.close();
                                    }
                                });
                            }
                            (function () {
                                var aMoneyList = jQuery(".pay_val li");
                                aMoneyList.bind("click", function () {
                                    var iDataVal = jQuery(this).data("val");
                                    if (iDataVal != "more") {
                                        jQuery("#curMoney").val(iDataVal);
                                        aMoneyList.removeClass("add");
                                        jQuery(this).addClass("add");
                                    } else {
                                        window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&pageRecord=" + config.recordPage + "&touch_flag=down";
                                        aMoneyList.removeClass("add");
                                    }
                                });
                            })();
                        } else {
                            var zhekouStr = zhekouPrice = "";
                            if (iData.discountProduct != undefined && iData.discountProduct) {
                                var zhekouStr = '<span class="off_nine">9折</span>';
                                var zhekouPrice = '<span style="color:#ff0000;">' + (iData.data.p_price_str * 0.9).toFixed(2) + '</span><del style="color:#cacaca;padding-left:5px;" >' + iData.data.p_price_str + '</del>';
                            } else {
                                var zhekouPrice = '<span style="color:#ff0000;">' + iData.data.p_price_str + '</span>'
                            }
                            var j_recharge = new Factory({
                                id: "moneyPop",
                                content: '<p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：' + zhekouStr + zhekouPrice + '</p><p style="font-size:14px;line-height:24px;">您的余额不足，<b>请先进行账户充值：</b></p><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '">' + iData.moneyHtml,
                                btn: ["取消", "充值并购买"],
                                title: false,
                                padding: "10px 15px",
                                onOk: function () {
                                    var oAmount = jQuery(".pay_val .add").data("val");
                                    window.location.href = "/jsp_cn/touchPay/dispatchReq.jsp?d=touchEnd&pid=" + config.pid + "&amount=" + oAmount + "&pageRecord=" + config.recordPage + "&touch_flag=down";
                                    if (is_weixin()) { //
                                        weixinExpTips(config, 3);
                                    }
                                }
                            });
                            (function () {
                                var aMoneyList = jQuery(".pay_val li");
                                aMoneyList.bind("click", function () {
                                    var iDataVal = jQuery(this).data("val");
                                    if (iDataVal != "more") {
                                        jQuery("#curMoney").val(iDataVal);
                                        aMoneyList.removeClass("add");
                                        jQuery(this).addClass("add");
                                    } else {
                                        window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&touch_flag=down&pageRecord=" + config.recordPage;
                                        aMoneyList.removeClass("add");
                                    }
                                });
                            })();
                        }
                    } else if (iData.status == 3) { //余额足够直接购买
                        inpmv(5972);
                        var zhekouStr = zhekouPrice = "";
                        if (iData.discountProduct != undefined && iData.discountProduct) {
                            var zhekouStr = '<span class="off_nine">9折</span>';
                            var zhekouPrice = '<span style="color:#ff0000;">' + (iData.data.p_price_str * 0.9).toFixed(2) + '</span><del style="color:#cacaca;padding-left:5px;" >' + iData.data.p_price_str + '</del>';
                        } else {
                            var zhekouPrice = '<span style="color:#ff0000;">' + iData.data.p_price_str + '</span>'
                        }
                        var j_confirm_buy = new SliderFactory({
                            id: 'j_confirm_buy',
                            title: '确定购买么？',
                            content: '<p style="font-size:16px;line-height:24px;color:#333;">获取文档需支付豆元：<span class="fcr">' + zhekouStr + zhekouPrice + '</span></p>',
                            footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                            onOk: function () {
                                //发请求支付
                                jQuery.ajax({
                                    url: "/touchPay/purchaseProduct_v2.do", //1：成功  -1：失败
                                    data: "pid=" + config.pid + "&pageRecord=" + config.recordPage + "&dealFlag=2",
                                    success: function (data) {
                                        var iData1 = JSON.parse(data);
                                        yuezuHandel(config, iData1);
                                    }
                                });
                            },
                            method: function () {
                                if (canJump) {
                                    openAppMethod("j_confirm_buy");
                                }
                            }

                        });
                    } else if (iData.status == 1) { //可直接下载  第二次下载就得有app导量
                        localStoreToApp(iData, deviceType);
                    } else if (iData.status == 0) {
                        //未登录
                        setCookie2008_1("html_down_key", "touch_html_end_value_down");
                        showLogin(null, 0, "pageRecord=" + config.recordPage);

                        // 微信浏览器游客快捷支付收费文档
                        // if (!rechargeConfig.isBuildProduct && is_weixin() && (rechargeConfig.ifCharge == 1 || rechargeConfig.ifCharge == 3)) {
                        // 	createQuickpayment(iData, config, 3);
                        // } else {
                        // 	// 其他浏览器和免费文档
                        // 	setCookie2008_1("html_down_key", "touch_html_end_value_down");
                        // 	showLogin(null, 0, "pageRecord=" + config.recordPage);
                        // }
                    } else if (iData.status == 4) { //普通用户下载达到10篇上限
                        // var j_limit_tips = new Factory({
                        // 	id: "j_limit",
                        // 	iClose: 1,
                        // 	content: '<p style="font-size:16px;line-height:24px;text-align:left;padding:20px 0 0;">抱歉，您今天下载免费文档的数量已达 10 篇上限。</p>',
                        // 	btn: "开通VIP,无限制下载",
                        // 	btnRole: 1,
                        // 	title: false,
                        // 	padding: "15px",
                        // 	onOk: function () {
                        // 		inpmv(6018); //开通VIP的点击量
                        // 		window.open("/touchPay/touch_vip.do", "_blank");
                        // 	},
                        // 	bindMethod: function () {
                        // 		openAppMethod("j_limit");
                        // 	}
                        // });
                        openVipGuideTip(0);
                    } else if (iData.status == 5) { //vip用户下载达到上限
                        var openStr1 = deviceType == 1 ? '<a id="localDown" style="display:block;" href="javascript:void(0);">保存至本地存储..</a>' : '<a id="localDown" style="display:block;" href="javascript:void(0);">导出至其它应用..</a>';
                        var j_limit_vip = new Factory({
                            id: 'j_limit_vip',
                            content: '<p id="downLoadApp" style="font-size:16px;padding:5px 0;font-size:18px;color:#4889f1;margin-bottom:15px;"><img style="width:45px;margin:0 15px 0 10px;vertical-align:middle;" src="' + picture_image_path_v1 + '/images_cn/ico_app_bookshop83x83.png" alt="" />下载到豆丁书房</p><p style="height:46px;line-height:46px;border-top:1px solid #ccc;">' + openStr1 + '</p>',
                            bottom: false,
                            title: false,
                            iClose: 1,
                            padding: "20px 20px 0",
                            bindMethod: function () {
                                openAppMethod("j_limit_vip");
                            }
                        });
                    } else if (iData.status == 15) { //APP导量测试
                        openAndroidApp();
                        createDownAndroidTips();
                    }

                } else if (iData.buildProduct == true) {
                    if (iData.status == 6) { //建筑非vip 钱够
                        var j_confirm_buy = new SliderFactory({
                            id: 'j_confirm_buy',
                            title: '确定购买么？',
                            content: '<p style="text-align:center;font-size:16px;padding:10px 0;"><a href="/jsp_cn/touch/build/build_vip.jsp?pid=' + config.pid + '" title="成为建筑会员" style="text-decoration:underline;color:#069;">&gt;&gt;成为建筑会员</a>可<span style="color:#ff0000;">免费</span>下载该文档</p><p style="text-align:center;font-size:16px;padding:10px 0;">获取文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span></p>',
                            padding: '12px 15px',
                            footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                            onOk: function () {
                                //发请求支付
                                jQuery.ajax({
                                    url: "/touchPay/purchaseProduct_v2.do", //1：成功  -1：失败
                                    data: "pid=" + config.pid + "&pageRecord=" + config.recordPage + "&dealFlag=2",
                                    success: function (data) {
                                        var iData1 = JSON.parse(data);
                                        yuezuHandel(config, iData1, 2);
                                    }
                                });
                            }

                        });
                    } else if (iData.status == 7) { //建筑非vip 钱不够
                        if (iData.ifbj) {
                            var j_recharge = new Factory({
                                id: "moneyPop",
                                content: '<p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span></p><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '"><p style="font-size:14px;line-height:24px;"><b>建筑会员</b><span style="color:red">免费</span><b>下载该文档</b>,<a href="/jsp_cn/touch/build/build_vip.jsp?pid=' + config.pid + '&flag=down">&gt;&gt;马上成为会员</a></p><p style="font-size:14px;line-height:24px;">您的余额不足，请通过以下途径获取豆元：</p>',
                                btn: "我知道了",
                                btnRole: 1,
                                title: false,
                                padding: "10px 15px",
                                onOk: function () {
                                    j_recharge.close();
                                }
                            });
                        } else {
                            var j_recharge = new Factory({
                                id: "moneyPop",
                                content: '<p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span></p><p style="text-align:left;font-size:14px;padding:10px 0;"><a href="/jsp_cn/touch/build/build_vip.jsp?pid=' + config.pid + '" title="成为建筑会员" style="text-decoration:underline;color:#069;">&gt;&gt;成为建筑会员</a>可<span style="color:#ff0000;">免费</span>下载该文档</p><p style="font-size:14px;line-height:24px;">或者请先<b>充值账户豆元</b>并完成购买:</p><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '">' + iData.moneyHtml,
                                btn: ["取消", "充值并购买"],
                                title: false,
                                padding: "10px 15px",
                                onOk: function () {
                                    var oAmount = jQuery(".pay_val .add").data("val");
                                    window.location.href = "/jsp_cn/touchPay/dispatchReq.jsp?d=touchEnd&pid=" + config.pid + "&amount=" + oAmount + "&pageRecord=" + config.recordPage + "&touch_flag=down";
                                    if (is_weixin()) { //
                                        weixinExpTips(config, 3);
                                    }
                                }
                            });
                            (function () {
                                var aMoneyList = jQuery(".pay_val li");
                                aMoneyList.bind("click", function () {
                                    var iDataVal = jQuery(this).data("val");
                                    if (iDataVal != "more") {
                                        jQuery("#curMoney").val(iDataVal);
                                        aMoneyList.removeClass("add");
                                        jQuery(this).addClass("add");
                                    } else {
                                        window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&touch_flag=down&pageRecord=" + config.recordPage;
                                        aMoneyList.removeClass("add");
                                    }
                                });
                            })();
                        }
                    } else if (iData.status == 8) { //建筑vip 免费下载
                        var j_confirm_buy = new SliderFactory({
                            id: 'j_confirm_buy',
                            title: '确定购买么？',
                            content: '<p style="font-size:16px;line-height:24px;color:#333;">获取文档需支付豆元：<span class="fcr">' + iData.data.p_price_str + '</span></p><p style="text-align:center;font-size:16px;padding:10px 0;">您是尊贵的建筑会员，可<span style="color:#ff0000;">免费</span>下载</p>',
                            onOk: function () {
                                if (iData.errmsg == "true") {
                                    showDownLoadSign(1, config, "请验证后保存文档");
                                } else if (iData.errmsg == "false") {
                                    showDownLoadSign(2, config, "请验证后保存文档");
                                } else {
                                    localStoreToApp(iData, deviceType);
                                }
                            }

                        });
                    } else if (iData.status == 9) { //建筑vip 下载券够 钱不够2 3
                        var payWay = 0;
                        if (iData.ifbj) {
                            var j_confirm_buy = new Factory({
                                id: 'j_confirm_buy',
                                content: '<p style="text-align:center;font-size:16px;padding:5px 0;font-weight:bold;">确定购买么？</p><ul class="pay_chose" style="padding:8px 0 16px;"><li><span class="radio selected"></span>使用下载券</li><li style="text-align:right;"><span class="radio"></span>不使用下载券</li></ul><div class="tips_con"><p style="text-align:left;font-size:14px;padding:10px 0;">该文档为收费文档，所需豆元：' + iData.data.p_price_str + '</p><p style="text-align:left;font-size:14px;padding:10px 0;">你当前剩余下载券：<span style="color:#ff0000;">' + iData.remaind_ticket + '</span>&nbsp;张</p><p style="text-align:left;font-size:14px;padding:10px 0;">下载需使用下载券：<span style="color:#ff0000;">' + iData.need_ticket + '</span>&nbsp;张，要支付吗？</p></div><div class="tips_con" style="display:none;"><p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span></p><p style="font-size:14px;line-height:24px;">您可以通过以下途径获取豆元：</p></br><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '"></div>',
                                btn: ["取消", "确定"],
                                title: false,
                                onOk: function () {
                                    if (payWay == 0) {
                                        jQuery.ajax({
                                            url: "/touchPay/purchaseProduct_v2.do", //1：成功  -1：失败
                                            data: "pid=" + config.pid + "&pageRecord=" + config.recordPage + "&dealFlag=2&isUseBuildTicket=1",
                                            success: function (data) {
                                                var iData1 = JSON.parse(data);
                                                yuezuHandel(config, iData1);
                                            }
                                        });
                                    } else if (payWay == 1) {
                                        j_confirm_buy.close();
                                    }
                                },
                                bindMethod: function () {
                                    jQuery('<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>').insertAfter(jQuery("#j_confirm_buy .docin-ui-foot"));
                                }
                            });

                            (function () {
                                var aMoneyList = jQuery(".pay_val li");
                                aMoneyList.bind("click", function () {
                                    var iDataVal = jQuery(this).data("val");
                                    if (iDataVal != "more") {
                                        jQuery("#curMoney").val(iDataVal);
                                        aMoneyList.removeClass("add");
                                        jQuery(this).addClass("add");
                                    } else {
                                        window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&touch_flag=down&pageRecord=" + config.recordPage;
                                        aMoneyList.removeClass("add");
                                    }
                                });
                                jQuery('.pay_chose li').on('click', function () {
                                    var theIndex = jQuery(this).index();
                                    payWay = theIndex;
                                    jQuery('.pay_chose li span').removeClass('selected');
                                    jQuery(this).find('span').addClass('selected')
                                    jQuery('.tips_con').hide();
                                    jQuery('.tips_con').eq(theIndex).show();
                                    if (theIndex == 0) {
                                        jQuery('.docin_ui_btn1').html('确定');
                                        jQuery('.ui-btns-box').eq(0).show();
                                        jQuery('.docin-ui-wrapper>p:last-child').show();
                                    } else if (theIndex == 1) {
                                        jQuery('.docin_ui_btn1').html('我知道了');
                                        jQuery('.ui-btns-box').eq(0).hide();
                                        jQuery('.docin-ui-wrapper>p:last-child').hide();
                                    }
                                });
                            }());
                        } else {
                            var j_confirm_buy = new Factory({
                                id: 'j_confirm_buy',
                                content: '<p style="text-align:center;font-size:16px;padding:5px 0;font-weight:bold;">确定购买么？</p><ul class="pay_chose" style="padding:8px 0 16px;"><li><span class="radio selected"></span>使用下载券</li><li style="text-align:right;"><span class="radio"></span>不使用下载券</li></ul><div class="tips_con"><p style="text-align:left;font-size:14px;padding:10px 0;">该文档为收费文档，所需豆元：' + iData.data.p_price_str + '</p><p style="text-align:left;font-size:14px;padding:10px 0;">你当前剩余下载券：<span style="color:#ff0000;">' + iData.remaind_ticket + '</span>&nbsp;张</p><p style="text-align:left;font-size:14px;padding:10px 0;">下载需使用下载券：<span style="color:#ff0000;">' + iData.need_ticket + '</span>&nbsp;张，确定支付吗？</p></div><div class="tips_con" style="display:none;"><p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span></p><p style="font-size:14px;line-height:24px;">您的余额不足，<b>请先进行账户充值:</b></p><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '">' + iData.moneyHtml + '</div>',
                                btn: ["取消", "确定"],
                                title: false,
                                onOk: function () {
                                    //发请求支付
                                    if (payWay == 0) {
                                        jQuery.ajax({
                                            url: "/touchPay/purchaseProduct_v2.do", //1：成功  -1：失败
                                            data: "pid=" + config.pid + "&pageRecord=" + config.recordPage + "&dealFlag=2&isUseBuildTicket=1",
                                            success: function (data) {
                                                var iData1 = JSON.parse(data);
                                                yuezuHandel(config, iData1);
                                            }
                                        });
                                    } else if (payWay == 1) {
                                        var oAmount = jQuery(".pay_val .add").data("val");
                                        window.location.href = "/jsp_cn/touchPay/dispatchReq.jsp?d=touchEnd&pid=" + config.pid + "&amount=" + oAmount + "&pageRecord=" + config.recordPage + "&touch_flag=down";
                                        if (is_weixin()) { //
                                            weixinExpTips(config, 3);
                                        }
                                    }
                                },
                                bindMethod: function () {
                                    jQuery('<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>').insertAfter(jQuery("#j_confirm_buy .docin-ui-foot"));
                                }
                            });
                            (function () {
                                var aMoneyList = jQuery(".pay_val li");
                                aMoneyList.bind("click", function () {
                                    var iDataVal = jQuery(this).data("val");
                                    if (iDataVal != "more") {
                                        jQuery("#curMoney").val(iDataVal);
                                        aMoneyList.removeClass("add");
                                        jQuery(this).addClass("add");
                                    } else {
                                        window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&touch_flag=down&pageRecord=" + config.pageRecord;
                                        aMoneyList.removeClass("add");
                                    }
                                });
                                jQuery('.pay_chose li').on('click', function () {
                                    var theIndex = jQuery(this).index();
                                    payWay = theIndex;
                                    jQuery('.pay_chose li span').removeClass('selected');
                                    jQuery(this).find('span').addClass('selected')
                                    jQuery('.tips_con').hide();
                                    jQuery('.tips_con').eq(theIndex).show();
                                    if (theIndex == 0) {
                                        jQuery('.docin_ui_btn1').html('确定');
                                        jQuery('.docin-ui-wrapper>p:last-child').show();
                                    } else if (theIndex == 1) {
                                        jQuery('.docin_ui_btn1').html('充值并购买');
                                        jQuery('.docin-ui-wrapper>p:last-child').hide();
                                    }
                                });
                            }());
                        }
                    } else if (iData.status == 10) { //建筑vip 下载券够 钱够2 4
                        var payWay = 0;
                        var j_confirm_buy = new SliderFactory({
                            id: 'j_confirm_buy',
                            title: '确定购买么？',
                            content: '<ul class="pay_chose" style="padding:8px 0 16px;font-size:16px;"><li><span class="radio selected"></span>使用下载券</li><li style="text-align:left;"><span class="radio"></span>不使用下载券</li></ul><div class="tips_con"><p style="text-align:center;font-size:16px;padding:10px 0;color:#333;">你当前剩余下载券：' + iData.remaind_ticket + '&nbsp;张</p><p style="text-align:center;font-size:16px;padding:10px 0;color:#333;">该文档需用下载券：<span style="color:#ff0000;">' + iData.need_ticket + '</span>&nbsp;张，要支付吗？</p></div><div class="tips_con" style="display:none;"><p style="text-align:center;font-size:16px;color:#333;padding:10px 0;">你当前剩余豆元：' + iData.data.userBalance_str + '</p><p style="text-align:center;font-size:16px;color:#333;padding:10px 0;">该文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span>，要支付吗？</p></div>',
                            padding: '12px 15px',
                            footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                            onOk: function () {
                                //发请求支付
                                var payData;
                                if (payWay == 0) {
                                    payData = "pid=" + config.pid + "&pageRecord=" + config.pageRecord + "&dealFlag=2&isUseBuildTicket=1";
                                } else if (payWay == 1) {
                                    payData = "pid=" + config.pid + "&pageRecord=" + config.pageRecord + "&dealFlag=2";
                                }
                                jQuery.ajax({
                                    url: "/touchPay/purchaseProduct_v2.do", //1：成功  -1：失败
                                    data: payData,
                                    success: function (data) {
                                        var iData1 = JSON.parse(data);
                                        yuezuHandel(config, iData1);
                                    }
                                });
                            },
                            footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                            method: function () {
                                jQuery('.pay_chose li').on('click', function () {
                                    var theIndex = jQuery(this).index();
                                    payWay = theIndex;
                                    jQuery('.pay_chose li span').removeClass('selected');
                                    jQuery(this).find('span').addClass('selected')
                                    jQuery('.tips_con').hide();
                                    jQuery('.tips_con').eq(theIndex).show();
                                });
                            }
                        });
                    } else if (iData.status == 11) { //建筑vip 下载券不够 钱不够1 3
                        var payWay = 0;
                        if (iData.ifbj) {
                            var j_confirm_buy = new Factory({
                                id: 'j_confirm_buy',
                                content: '<p style="text-align:center;font-size:16px;padding:5px 0;font-weight:bold;">确定购买么？</p><ul class="pay_chose" style="padding:8px 0 16px;"><li><span class="radio selected"></span>使用下载券</li><li style="text-align:right;"><span class="radio"></span>不使用下载券</li></ul><div class="tips_con"><p style="text-align:left;font-size:14px;padding:10px 0;">该文档为收费文档，所需豆元：' + iData.data.p_price_str + '</p><p style="text-align:left;font-size:14px;padding:10px 0;">你当前剩余下载券：<span style="color:#ff0000;">' + iData.remaind_ticket + '</span>&nbsp;张</p><p style="text-align:left;font-size:14px;padding:10px 0;">下载需使用下载券：<span style="color:#ff0000;">' + iData.need_ticket + '</span>&nbsp;张，不足以支付</p></div><div class="tips_con" style="display:none;"><p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span></p><p style="font-size:14px;line-height:24px;">您的余额不足，请通过以下途径获取豆元</p></br><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '"></div>',
                                btn: ["取消", "获取下载券"],
                                title: false,
                                onOk: function () {
                                    if (payWay == 0) {
                                        window.location.href = '/jsp_cn/touch/build/build_vip.jsp?pid=' + config.pid;
                                    } else if (payWay == 1) {
                                        j_confirm_buy.close();
                                    }
                                },
                                bindMethod: function () {
                                    jQuery('<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>').insertAfter(jQuery("#j_confirm_buy .docin-ui-foot"));
                                }
                            });
                            (function () {
                                var aMoneyList = jQuery(".pay_val li");
                                aMoneyList.bind("click", function () {
                                    var iDataVal = jQuery(this).data("val");
                                    if (iDataVal != "more") {
                                        jQuery("#curMoney").val(iDataVal);
                                        aMoneyList.removeClass("add");
                                        jQuery(this).addClass("add");
                                    } else {
                                        window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&touch_flag=down&pageRecord=" + config.pageRecord;
                                        aMoneyList.removeClass("add");
                                    }
                                });
                                jQuery('.pay_chose li').on('click', function () {
                                    var theIndex = jQuery(this).index();
                                    payWay = theIndex;
                                    jQuery('.pay_chose li span').removeClass('selected');
                                    jQuery(this).find('span').addClass('selected')
                                    jQuery('.tips_con').hide();
                                    jQuery('.tips_con').eq(theIndex).show();
                                    if (theIndex == 0) {
                                        jQuery('.docin_ui_btn1').html('获取下载券');
                                        jQuery('.ui-btns-box').eq(0).show();
                                        jQuery('.docin-ui-wrapper>p:last-child').show();
                                    } else if (theIndex == 1) {
                                        jQuery('.docin_ui_btn1').html('我知道了');
                                        jQuery('.ui-btns-box').eq(0).hide();
                                        jQuery('.docin-ui-wrapper>p:last-child').hide();
                                    }
                                });
                            }());
                        } else {
                            var j_confirm_buy = new Factory({
                                id: 'j_confirm_buy',
                                content: '<p style="text-align:center;font-size:16px;padding:5px 0;font-weight:bold;">确定购买么？</p><ul class="pay_chose" style="padding:8px 0 16px;"><li><span class="radio selected"></span>使用下载券</li><li style="text-align:right;"><span class="radio"></span>不使用下载券</li></ul><div class="tips_con"><p style="text-align:left;font-size:14px;padding:10px 0;">该文档为收费文档，所需豆元：' + iData.data.p_price_str + '</p><p style="text-align:left;font-size:14px;padding:10px 0;">你当前剩余下载券：<span style="color:#ff0000;">' + iData.remaind_ticket + '</span>&nbsp;张</p><p style="text-align:left;font-size:14px;padding:10px 0;">下载需使用下载券：<span style="color:#ff0000;">' + iData.need_ticket + '</span>&nbsp;张，不足以支付</p></div><div class="tips_con" style="display:none;"><p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span></p><p style="font-size:14px;line-height:24px;">您的余额不足，<b>请先进行账户充值:</b></p><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '">' + iData.moneyHtml + '</div>',
                                btn: ["取消", "获取下载券"],
                                title: false,
                                onOk: function () {
                                    //发请求支付
                                    if (payWay == 0) {
                                        window.location.href = '/jsp_cn/touch/build/build_vip.jsp?pid=' + config.pid;
                                    } else if (payWay == 1) {
                                        var oAmount = jQuery(".pay_val .add").data("val");
                                        window.location.href = "/jsp_cn/touchPay/dispatchReq.jsp?d=touchEnd&pid=" + config.pid + "&amount=" + oAmount + "&pageRecord=" + config.pageRecord + "&touch_flag=down";
                                        if (is_weixin()) { //
                                            weixinExpTips(config, 3);
                                        }
                                    }
                                },
                                bindMethod: function () {
                                    jQuery('<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>').insertAfter(jQuery("#j_confirm_buy .docin-ui-foot"));
                                }
                            });
                            (function () {
                                var aMoneyList = jQuery(".pay_val li");
                                aMoneyList.bind("click", function () {
                                    var iDataVal = jQuery(this).data("val");
                                    if (iDataVal != "more") {
                                        jQuery("#curMoney").val(iDataVal);
                                        aMoneyList.removeClass("add");
                                        jQuery(this).addClass("add");
                                    } else {
                                        window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&touch_flag=down&pageRecord=" + config.pageRecord;
                                        aMoneyList.removeClass("add");
                                    }
                                });
                                jQuery('.pay_chose li').on('click', function () {
                                    var theIndex = jQuery(this).index();
                                    payWay = theIndex;
                                    jQuery('.pay_chose li span').removeClass('selected');
                                    jQuery(this).find('span').addClass('selected')
                                    jQuery('.tips_con').hide();
                                    jQuery('.tips_con').eq(theIndex).show();
                                    if (theIndex == 0) {
                                        jQuery('.docin_ui_btn1').html('获取下载券');
                                        jQuery('.docin-ui-wrapper>p:last-child').show();
                                    } else if (theIndex == 1) {
                                        jQuery('.docin_ui_btn1').html('充值并购买');
                                        jQuery('.docin-ui-wrapper>p:last-child').hide();
                                    }
                                });
                            }());
                        }
                    } else if (iData.status == 12) { //建筑vip 下载券不够 钱够1 4
                        var payWay = 0;
                        var j_confirm_buy = new SliderFactory({
                            id: 'j_confirm_buy',
                            cls: 'build_tiket',
                            title: '确定购买么？',
                            buttons: ["取消", "获取下载券"],
                            content: '<ul class="pay_chose" style="padding:8px 0 16px;font-size:18px;color:#333;"><li><span class="radio selected"></span>使用下载券</li><li style="text-align:left;"><span class="radio"></span>不使用下载券</li></ul><div class="tips_con"><p style="text-align:center;font-size:16px;padding:10px 0;color:#333;">你当前剩余下载券：' + iData.remaind_ticket + '&nbsp;张</p><p style="text-align:center;font-size:16px;padding:10px 0;color:#333;">该文档需用下载券：<span style="color:#ff0000;">' + iData.need_ticket + '</span>&nbsp;张，<span style="color:#ff0000;">不足以支付</span></p></div><div class="tips_con" style="display:none;"><p style="text-align:center;font-size:16px;padding:10px 0;color:#333;">你当前剩余豆元：<span style="color:#333;">' + iData.data.userBalance_str + '</span></p><p style="text-align:center;font-size:16px;padding:10px 0;color:#333;">该文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span>，要支付吗？</p></div>',
                            padding: '12px 15px',
                            footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                            onOk: function () {
                                //发请求支付
                                if (payWay == 0) {
                                    window.location.href = '/jsp_cn/touch/build/build_vip.jsp?pid=' + config.pid;
                                } else if (payWay == 1) {
                                    jQuery.ajax({
                                        url: "/touchPay/purchaseProduct_v2.do", //1：成功  -1：失败
                                        data: "pid=" + config.pid + "&pageRecord=" + config.pageRecord + "&dealFlag=2",
                                        success: function (data) {
                                            var iData1 = JSON.parse(data);
                                            yuezuHandel(config, iData1);
                                        }
                                    });
                                }
                            },
                            footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                            method: function () {
                                jQuery('.pay_chose li').on('click', function () {
                                    var theIndex = jQuery(this).index();
                                    payWay = theIndex;
                                    jQuery('.pay_chose li span').removeClass('selected');
                                    jQuery(this).find('span').addClass('selected')
                                    jQuery('.tips_con').hide();
                                    jQuery('.tips_con').eq(theIndex).show();
                                    if (theIndex == 0) {
                                        jQuery('#j_confirm_buy .btn_conform').html('获取下载券');
                                        jQuery("#j_confirm_buy").addClass("build_tiket");

                                    } else if (theIndex == 1) {
                                        jQuery('#j_confirm_buy .btn_conform').html('确定');
                                        jQuery("#j_confirm_buy").removeClass("build_tiket");
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
        return false;
    });
}

function purchaseHandel(config) { //立即购买、余额不足充值
    if (typeof (config) == "undefined") {
        return;
    }
    var pendingRequests = {};
    jQuery(document).on("touchend", ".freeDown .ico_button[data-freetype='purchase']", function () {
        var dealFlag = 1;
        if (typeof (rechargeConfig) != "undefined" && rechargeConfig.ifCharge > 3) {
            dealFlag = 1;
        }
        if (jQuery('.freeDown').find('input').length > 0) {
            var rtype = jQuery('.freeDown input:radio:checked').attr('rtype');
            if (rtype == 'payread') {
                dealFlag = 1;
            } else if (rtype == 'paydown') {
                dealFlag = 2;
            }
        }
        var c_value = getCookie2008_1("html_down_key");
        if (c_value == "touch_html_end_value_pay1") {
            dealFlag = 1;
        } else if (c_value == "touch_html_end_value_pay2") {
            dealFlag = 2;
        }
        if (config.isPriceEq != undefined && config.isPriceEq) {
            dealFlag = 1;
        }
        if (dealFlag == 2) { //阅读全文+文档下载时走下载逻辑
            jQuery("*[data-handel='download']").eq(0).trigger("touchend"); //立即下载
            return false;
        }
        var pendingRequests = {};
        jQuery.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            var key = options.url;
            //console.log(key);
            var reg = new RegExp("touchPay");
            if (reg.test(key)) {
                key = "touchPay";
            }
            if (!pendingRequests[key]) {
                pendingRequests[key] = jqXHR;
            } else {
                //jqXHR.abort();    //放弃后触发的提交
                pendingRequests[key].abort(); // 放弃先触发的提交
            }

            var complete = options.complete;
            options.complete = function (jqXHR, textStatus) {
                pendingRequests[key] = null;
                if (jQuery.isFunction(complete)) {
                    complete.apply(this, arguments);
                }
            };
        });
        jQuery.ajax({
            type: 'POST',
            url: "/touchPay/preparePay.do",
            data: "pid=" + config.pid + "&dealFlag=" + dealFlag + "&ispayforread=" + config.isPriceEq,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                jQuery('<div id="buyTips" class="waitingShow"><span>服务器繁忙，请重试</span></div>').appendTo(jQuery(document.body));
                setWaitingShow();
            },
            success: function (data) {
                //-1异常；1购买过；2余额不足  3：余额足够 0:未登录
                //{"data":{"need_money":3.978,"p_price":3.98,"userBalance":0.002},"errmsg":"success","status":2}
                if (jQuery("#buyTips").length > 0) {
                    jQuery("#buyTips").remove();
                }
                var iData = JSON.parse(data);
                if (iData.status == 14) {
                    window.open("/app/errorMessage?message=664");
                    return;
                } else if (iData.status == 2) { //余额不足请充值
                    inpmv(5973);
                    if (iData.ifbj) {
                        if (config.uploaderId == "146165196") {
                            var j_recharge = new Factory({
                                id: 'moneyPop',
                                content: '<p style="text-align:center;font-size:16px;padding:5px 0;font-weight:bold;">您正在购买</p><p style="text-align:left;font-size:14px;padding:8px 0;">名称：考研文档</p><p style="text-align:left;font-size:14px;padding:2px 0;">您的账户可支付充值豆元：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="text-align:left;font-size:14px;padding:2px 0;">您的余额不足，还需充值：<span style="color:#ff0000;">' + iData.data.need_money_str + '</span></p>',
                                btn: ["取消", "充值并购买"],
                                title: false,
                                onOk: function () {
                                    window.location.href = "/jsp_cn/touchPay/dispatchReq.jsp?d=touchEnd&pid=" + config.pid + "&amount=" + iData.data.need_money_str + "&pageRecord=" + config.recordPage + "&dealFlag=" + dealFlag;
                                }
                            });
                        } else {
                            var j_recharge = new Factory({
                                id: "moneyPop",
                                content: '<p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：<span style="color:#ff0000;">' + iData.data.p_price_str + '</span></p><p style="font-size:14px;line-height:24px;">您的余额不足，<b>请通过以下途径获取豆元：</b></p></br><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '"><ul style="margin-left: 20px;font-size:14px;"><li style="list-style-type:disc;">在PC端网页<b>上传文档</b></li><li style="list-style-type:disc;">您上传的文档被浏览或被下载</li><li style="list-style-type:disc;">在PC端网页参与完成<b>豆丁任务</b></li></ul></br>',
                                btn: "我知道了",
                                btnRole: 1,
                                title: false,
                                padding: "10px 15px",
                                onOk: function () {
                                    j_recharge.close();
                                }
                            });
                        }
                        (function () {
                            var aMoneyList = jQuery(".pay_val li");
                            aMoneyList.bind("click", function () {
                                var iDataVal = jQuery(this).data("val");
                                if (iDataVal != "more") {
                                    jQuery("#curMoney").val(iDataVal);
                                    aMoneyList.removeClass("add");
                                    jQuery(this).addClass("add");
                                } else {
                                    window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&pageRecord=" + config.recordPage + "&touch_flag=down";
                                    aMoneyList.removeClass("add");
                                }
                            });
                        })();
                    } else {
                        var zhekouStr = zhekouPrice = "";
                        if (iData.discountProduct != undefined && iData.discountProduct) {
                            zhekouStr = '<span class="off_nine">9折</span>';
                            zhekouPrice = '<span style="color:#ff0000;">' + (iData.data.p_price_str * 0.9).toFixed(2) + '</span><del style="color:#cacaca;padding-left:5px;" >' + iData.data.p_price_str + '</del>';
                        } else {
                            var zhekouPrice = '<span style="color:#ff0000;">' + iData.data.p_price_str + '</span>'
                        }
                        var data_content = '<p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p style="font-size:14px;line-height:24px;">文档需支付豆元：' + zhekouStr + zhekouPrice + '</p><p style="font-size:14px;line-height:24px;">您的余额不足，<b>请先进行账户充值：</b></p><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '">' + iData.moneyHtml;
                        if (!config.isPriceEq && config.ifCharge == 3 && !config.isBuildProduct) {
                            if (dealFlag == 1) {
                                if (iData.discountProduct != undefined && iData.discountProduct) {
                                    zhekouStr = '<span style="margin-right:0;margin-left:5px;" class="off_nine">9折</span>';
                                    zhekouPrice = '<span style="color:#ff0000;float:right;width:80px;text-align:left;">' + (iData.data.p_price * 0.9).toFixed(2) + '<del style="color:#cacaca;padding-left:5px;">' + iData.data.p_price.toFixed(2) + '</del></span>';
                                } else {
                                    zhekouPrice = '<span style="color:#ff0000;float:right;width:80px;text-align:left;">' + iData.data.p_price.toFixed(2) + '</span>'
                                }
                                data_content = '<p style="font-size:14px;line-height:24px;">您的豆丁余额：<span style="color:#ff0000;">' + iData.data.userBalance_str + '</span></p><p class="off_price" style="font-size:14px;line-height:24px;"><label><input type="radio" name="pay_type" value="2" ' + (dealFlag == 2 ? 'checked="checked"' : '') + '/>阅读全文+文档下载' + zhekouStr + zhekouPrice + '</label></p><p class="off_price" style="font-size:14px;line-height:24px;"><label><input type="radio" name="pay_type" value="1" ' + (dealFlag == 1 ? 'checked="checked"' : '') + ' />仅在线阅读全文<span style="color:#ff0000;float:right;width:80px;text-align:left;">' + iData.data.preview_price.toFixed(2) + '</span></label></p><p style="font-size:14px;line-height:24px;">您的余额不足，<b>请先进行账户充值：</b></p><input id="curMoney" type="hidden" value="' + iData.data.need_money_str + '">' + iData.moneyHtml;
                            }
                        }
                        var j_recharge = new Factory({
                            id: "moneyPop",
                            content: data_content,
                            btn: ["取消", "充值并购买"],
                            title: false,
                            padding: "10px 15px",
                            onOk: function () {
                                var oAmount = jQuery(".pay_val .add").data("val");
                                window.location.href = "/jsp_cn/touchPay/dispatchReq.jsp?d=touchEnd&pid=" + config.pid + "&amount=" + oAmount + "&pageRecord=" + config.recordPage + "&dealFlag=" + dealFlag;
                                if (is_weixin()) { //
                                    weixinExpTips(config, 2);
                                }
                            }
                        });
                        var check_val = jQuery('#moneyPop input[name="pay_type"]:checked').val();
                        jQuery('#moneyPop input[name="pay_type"]').on('click', function () {
                            var cur_val = jQuery(this).val();
                            if (cur_val == check_val) {
                                return;
                            }
                            if (cur_val == 1) { //阅读
                                jQuery('input[name="choose_pay"]:first').prop('checked', true);
                                jQuery('input[name="choose_pay"]:last').prop('checked', false);
                                jQuery('input[name="choose_pay"]:first').attr('checked', 'checked');
                                jQuery('input[name="choose_pay"]:last').removeAttr('checked');
                            } else { //下载
                                jQuery('input[name="choose_pay"]:first').prop('checked', false);
                                jQuery('input[name="choose_pay"]:last').prop('checked', true);
                                jQuery('input[name="choose_pay"]:first').removeAttr('checked');
                                jQuery('input[name="choose_pay"]:last').attr('checked', 'checked');
                            }
                            if (jQuery(this).prop("checked")) {
                                j_recharge.closeAll();
                                jQuery(".freeDown .ico_button[data-freetype='purchase']").trigger('touchend');


                            }
                        });
                        (function () {
                            var aMoneyList = jQuery(".pay_val li");
                            aMoneyList.bind("click", function () {
                                var iDataVal = jQuery(this).data("val");
                                if (iDataVal != "more") {
                                    jQuery("#curMoney").val(iDataVal);
                                    aMoneyList.removeClass("add");
                                    jQuery(this).addClass("add");
                                } else {
                                    window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&pageRecord=" + config.recordPage + "&dealFlag=" + dealFlag;
                                    aMoneyList.removeClass("add");
                                }
                            });
                        })();
                    }
                } else if (iData.status == 3) {
                    inpmv(5972);
                    var zhekouStr = zhekouPrice = "";
                    if (iData.discountProduct != undefined && iData.discountProduct) {
                        var zhekouStr = '<span class="off_nine">9折</span>';
                        var zhekouPrice = '<span style="color:#ff0000;">' + (iData.data.p_price_str * 0.9).toFixed(2) + '</span><del style="color:#cacaca;padding-left:5px;" >' + iData.data.p_price_str + '</del>';
                    } else {
                        var zhekouPrice = '<span style="color:#ff0000;">' + iData.data.p_price_str + '</span>'
                    }
                    var data_content = '<p style="text-align:center;font-size:16px;padding:10px 0;">文档需支付豆元：<span style="color:#ff0000;">' + zhekouStr + zhekouPrice + '</span></p>';
                    var labelCur = "";
                    if (!config.isPriceEq && config.ifCharge == 3 && !config.isBuildProduct) {
                        if (dealFlag == 1) {
                            if (iData.discountProduct != undefined && iData.discountProduct) {
                                zhekouStr = '<span style="margin-right:0;margin-left:5px;" class="off_nine">9折</span>';
                                zhekouPrice = '<span style="float:right;width:80px;text-align:right;">' + (iData.data.p_price * 0.9).toFixed(2) + '<del style="color:#cacaca;padding-left:5px;">' + iData.data.p_price.toFixed(2) + '</del></span>';
                            } else {
                                zhekouPrice = '<span style="float:right;width:80px;text-align:right;">' + iData.data.p_price.toFixed(2) + '</span>'
                            }
                            data_content = '<p class="off_price" style="font-size:16px;line-height:24px;width:90%;margin:0 auto 15px;text-align:left;"><label ><input type="radio" name="pay_type" value="2" ' + (dealFlag == 2 ? 'checked="checked"' : '') + '/>在线阅读全文+文档下载' + zhekouStr + zhekouPrice + '</label></p><p class="off_price" style="font-size:16px;line-height:24px;width:90%;margin:0 auto;text-align:left;"><label class="cur"><input type="radio" name="pay_type" value="1" ' + (dealFlag == 1 ? 'checked="checked"' : '') + ' />仅在线阅读全文<span style="float:right;width:80px;text-align:right;">' + iData.data.preview_price.toFixed(2) + '</span></label></p>';
                        }
                    }
                    var j_confirm_buy = new SliderFactory({
                        id: 'j_confirm_buy',
                        title: '确定购买么？',
                        content: data_content,
                        padding: '20px 20px 20px 15px',
                        footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                        onOk: function () {
                            //发请求支付
                            jQuery.ajax({
                                url: "/touchPay/purchaseProduct_v3.do", //1：成功  -1：失败
                                data: "pid=" + config.pid + "&pageRecord=" + config.recordPage + "&dealFlag=" + dealFlag,
                                success: function (data) {
                                    var iData1 = JSON.parse(data);
                                    if (iData1.status == 1) {
                                        jQuery('<div id="buyTips" class="waitingShow"><span>购买成功</span></div>').appendTo(jQuery(document.body));
                                        setWaitingShow();
                                        hideInSecond("buyTips", 2, function () {
                                            location.reload();
                                            //recoverReadRecord();
                                        });
                                    } else if (iData1.status == -1) {
                                        jQuery('<div id="buyTips" class="waitingShow"><span>购买失败</span></div>').appendTo(jQuery(document.body));
                                        setWaitingShow();
                                        hideInSecond("buyTips", 2);
                                    }
                                }
                            });
                        }

                    });
                    var check_val = jQuery('#j_confirm_buy input[name="pay_type"]:checked').val();
                    jQuery('#j_confirm_buy input[name="pay_type"]').on('click', function () {
                        var cur_val = jQuery(this).val();
                        var down_price = iData.data.p_price;
                        var read_price = iData.data.preview_price;
                        var balance = iData.data.userBalance_str;
                        jQuery('#j_confirm_buy input[name="pay_type"]').parent().removeClass("cur");
                        jQuery(this).parent().addClass("cur");
                        if (iData.discountProduct != undefined && iData.discountProduct) {
                            down_price = (down_price * 0.9);
                        }
                        if (cur_val == 1) { //阅读
                            jQuery('input[name="choose_pay"]:first').prop('checked', true);
                            jQuery('input[name="choose_pay"]:last').prop('checked', false);
                            jQuery('input[name="choose_pay"]:first').attr('checked', 'checked');
                            jQuery('input[name="choose_pay"]:last').removeAttr('checked');
                            dealFlag = 1;
                            //jQuery("#pay_detail").html("<b>阅读全文</b>需支付豆元：<span style='color:#ff0000;'>" + read_price.toFixed(2) + "</span>");
                        } else { //下载
                            jQuery('input[name="choose_pay"]:first').prop('checked', false);
                            jQuery('input[name="choose_pay"]:last').prop('checked', true);
                            jQuery('input[name="choose_pay"]:last').attr('checked', 'checked');
                            jQuery('input[name="choose_pay"]:first').removeAttr('checked');
                            dealFlag = 2;
                            //jQuery("#pay_detail").html("<b>阅读全文+文档下载</b>需支付豆元：<span style='color:#ff0000;'>" + down_price.toFixed(2) + "</span>");
                        }
                        if (config.toApp == 1 && cur_val == 2) { //APP导量购买时不管钱是否够跳APP
                            j_confirm_buy.close();
                            openAndroidApp();
                            createDownAndroidTips();
                            return false;
                        }
                        if (jQuery(this).prop("checked")) {
                            if (cur_val == 2 && (balance < down_price)) {
                                j_confirm_buy.close();
                                jQuery(".freeDown .ico_button[data-freetype='purchase']").trigger('touchend');
                            } else if (cur_val == 1 && (balance < read_price)) {
                                j_confirm_buy.close();
                                j_recharge.close();
                                jQuery(".freeDown .ico_button[data-freetype='purchase']").trigger("touchend");
                            }
                        }
                    });
                } else if (iData.status == 0) { //未登录
                    setCookie2008_1("html_down_key", "touch_html_end_value_pay" + dealFlag);
                    showLogin(null, 0, "pageRecord=" + config.recordPage);
                } else if (iData.status == 15) { //APP导量测试
                    openAndroidApp();
                    createDownAndroidTips();
                } else if (iData.status == 16) { //余额不足请充值 样式2
                    if (iData.ifbj == false) {
                        nobalancehandel(iData, config, 2);
                    }
                } else if (iData.status == 17) { //下载之前验证（易盾）
                    var captchaIns;
                    var showOrder = iData.errmsg;
                    showDownLoadSign(1, config, showOrder);
                } else if (iData.status == 18) { //下载之前验证（豆丁）
                    var showOrder = iData.errmsg;
                    showDownLoadSign(2, config, showOrder);
                }
            },
            complete: function (XMLHttpRequest, textStatus) {
            }
        });
    });
    return false;
}

var hideTimer = null;

function hideInSecond(id, time, fn) {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
        jQuery("#" + id).remove();
        if (fn) {
            fn();
        }
    }, time * 1000);
}

//添加黑色透明提示
function blackOpacityTips(tipStr) {
    if (jQuery("#blackTips").length > 0) {
        jQuery("#blackTips").remove();
        clearTimeout(hideTimer);
    }
    jQuery('<div id="blackTips" class="waitingShow"><span>' + tipStr + '</span></div>').appendTo(jQuery(document.body));
    setWaitingShow();
    hideInSecond("blackTips", 2);
}

function addFavSaveTips(invoiceid, downLoadUrl, iosdownloadclick) {
    var j_open_app_tips = new SliderFactory({
        id: 'JsaveApp',
        title: '用APP立即保存',
        content: '<a class="slider_btn btn_conform" style="margin-bottom:20px;margin-top:18px;"  href="' + downLoadUrl + '" ' + iosdownloadclick + '>下载安装APP</a><a class="slider_btn btn_cancel_01" style="color:#000;" href="javascript:void(0);">我知道了</a>',
        hasFoot: false,
        method: function () {
            jQuery("#JsaveApp .btn_cancel_01").unbind();
            jQuery("#JsaveApp .btn_cancel_01").bind("click", function () {
                j_open_app_tips.close();
                j_open_app_tips = null;
            });
        }
    });
}

jQuery(function () {
    function openLinkPara() {
        var curObjHeight = curObjWidth = iX = iY = 0;
        var lemmaTimer = null;
        if (jQuery("#docContent div[id^='page']").length == 0) {
            return;
        }
        jQuery("#docContent div[id^='page']").on("touchend", "a", function (event) {
            event.stopPropagation();
            var curTag = event.currentTarget;
            var iLemmaId = jQuery(this).data("id");
            if (iLemmaId != undefined) {
                var iURL = 'https://page.douding.cn/huangke/docxinshi/api/lemma?id=' + iLemmaId;
            } else {
                var iURL = jQuery(this).data("url");
            }

            jQuery.ajax({
                type: 'GET',
                url: iURL,
                //data:iParama + new Date().getTime(),
                beforeSend: function () { //触发ajax请求开始时执行
                    createLemmaLayout();
                },
                success: function (data) {
                    var iData = data;
                    if (iData != null && iData.status == "ok") {
                        createLemmaData(iData.content);
                        //getCurLinkPosition(curTag,iX,iY);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (errorThrown != 'abort') {
                        jQuery("#jLemmaLayout .inner .bd").html('<p style="text-align:center;height:100px;line-height:100px;">网络繁忙，请稍后再试...</p>');
                    }
                },
                complete: function () {
                }

            });
            setLemmaLayoutCenter("jLemmaLayout");
            return false;
        });

        function hideLemmaLayout() {
            if (jQuery("#jLemmaLayout").length > 0) {
                jQuery("#jLemmaLayout").fadeOut();
                jQuery("#jLemmaLayout").remove();
            }
        }

        function createLemmaLayout(curObj) {
            hideLemmaLayout();
            var oLemmaLayout = '<div id="jLemmaLayout"><div class="doc_entries_overlay"></div>';
            oLemmaLayout += '<div class="doc_entries_layout"><div class="inner"><div class="hd">';
            oLemmaLayout += '豆丁词条<span class="doc_entries_close">关闭</span></div>';
            oLemmaLayout += '<div class="bd"><p style="height:100px;background:url(' + picture_image_path_v1 + '/images_cn/newDocin/loading.gif) center center no-repeat;"></p></div>';
            oLemmaLayout += '<span class="entries_bottom_close"></span></div></div></div>';
            jQuery("body").append(jQuery(oLemmaLayout));
            jQuery(".doc_entries_close,.entries_bottom_close").click(function () {
                clearTimeout(lemmaTimer);
                hideLemmaLayout();
            });
        }

        function createLemmaData(iValue) {
            var lemmaVaule = iValue;
            var oLemmaStr = "";
            var lemmaTitle = lemmaVaule.title,
                lemmaDesc = subStrTitle(lemmaVaule.content, 140, 2),
                lemmaFrom = lemmaVaule.origin,
                lemmaLink = lemmaVaule.links,
                lemmaFromLink = lemmaVaule.origin_url == "" ? "" : '<a target="_blank" href="' + lemmaVaule.origin_url + '">查阅百科</a>';
            var aLinkStr = aLinkUrl = "";
            if (lemmaLink.length > 0) {
                var linkCss = "ico_min_link";
                for (var i = 0; i < lemmaLink.length; i++) {
                    var isMobile = lemmaLink[i].mobile;
                    if (isMobile == 0) {
                        continue;
                    }
                    var linkType = lemmaLink[i].type,
                        linkTitle = subStrTitle(lemmaLink[i].title, 40, 1),
                        linkHref = lemmaLink[i].url,
                        linkOrigin = lemmaLink[i].origin != "" ? '<i class="link_source">- ' + lemmaLink[i].origin + '</i>' : "";
                    if (linkType == "文档") {
                        linkCss = "ico_min_doc";
                        linkTitle += '.' + lemmaLink[i].format;
                    } else if (linkType == "链接") {
                        linkCss = "ico_min_link";
                    } else if (linkType == "视频") {
                        linkCss = "ico_min_video";
                    }
                    aLinkStr += '<li><span class="ico_min_entries ' + linkCss + '"></span><span class="li_r"><a class="doc_tit" href="' + linkHref + '" target="_blank">' + linkTitle + '</a>' + linkOrigin + '</span></li>'
                }
                aLinkUrl = "<ul>" + aLinkStr + "</ul>";
            }

            oLemmaStr += '<h3>' + lemmaTitle + '</h3><div class="doc_entries_scroll">';
            oLemmaStr += '<p class="entries_desc"><span>' + lemmaDesc + '</span>' + lemmaFromLink + '</p>';
            oLemmaStr += aLinkUrl + '</div>';
            if (jQuery("#jLemmaLayout .inner .bd").length > 0) {
                jQuery("#jLemmaLayout .inner .bd").html(oLemmaStr);
            }
            var objHeight = jQuery(window).height() * 0.6 - 106;
            //jQuery("#jLemmaLayout .doc_entries_layout").css({'height':objHeight});
            jQuery("#jLemmaLayout .doc_entries_scroll").css({
                'maxHeight': objHeight * 0.8
            });
        }

        function setLemmaLayoutCenter(id) {
            var obj = jQuery("#" + id);
            var oLeft = (jQuery(window).width() - obj.outerWidth()) / 2,
                oTop = jQuery(window).scrollTop() + (jQuery(window).height() - obj.outerHeight()) / 2;
            obj.css({
                'position': 'fixed',
                left: oLeft,
                top: oTop,
                'zIndex': 999
            }).show();
        }

        function subStrTitle(str, len, pos) {
            /**参数说明：
             * 根据长度截取先使用字符串，超长部分追加…
             * str 对象字符串
             * len 目标字节长度
             * pos 省略号位置 1:中间 2：文末
             * 返回值： 处理结果字符串
             */
            var iStr = str; //标题
            var totalLen = countStrLength(iStr);
            var temp1 = temp2 = "";
            if (totalLen <= len) {
                return str;
            } else {
                if (pos != undefined && pos == 1) {
                    temp1 = cutStr(iStr, 30);
                    temp2 = cutLastStr(iStr);
                    return temp1 + "..." + temp2;
                } else if (pos != undefined && pos == 2) {
                    return cutStr(iStr, len) + "..";
                }

            }

            function countStrLength(str) {
                var sTemp = "";
                var sLen = 0;
                for (var i = 0; i < str.length; i++) {
                    sTemp += str.charAt(i);
                    if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 128) {
                        sLen += 1;
                    } else {
                        sLen += 2;
                    }
                }
                return sLen;
            }

            function cutStr(str, needLength) {
                var sTemp = "";
                var sLen = 0;
                for (var i = 0; i < str.length; i++) {
                    sTemp += str.charAt(i);
                    if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 256) {
                        sLen += 1;
                    } else {
                        sLen += 2;
                    }
                    if (sLen >= needLength) {
                        sTemp = str.substring(0, i + 1);
                        return sTemp;
                    }
                }
            }

            function cutLastStr(str) {
                if (totalLen > 40) {
                    var sTemp = "";
                    sTemp = str.substring(str.length - 5);
                    return sTemp;
                }
            }
        }

        jQuery(document).bind("touchend", function (e) {
            if (jQuery('#jLemmaLayout').length == 0) return;
            var _con = jQuery('#jLemmaLayout'); // 设置目标区域
            //console.log(!_con.is(e.target));
            //console.log(_con.has(e.target).length);
            if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                jQuery('#jLemmaLayout').remove();
            }
        });
    }

    //openLinkPara();
});
jQuery(function () {
    jQuery('#login_tel, #login_tel_q').on('input propertychange', function () {
        if (jQuery(this).val() == '') {
            jQuery(this).next('.login_tel_f').removeClass('black')
        } else {
            jQuery(this).next('.login_tel_f').addClass('black')
        }
    });
});

function weixinCallback(pid, uid, typeFlag) {
    if (!(typeFlag == -1 || typeFlag == 0 || typeFlag == 1)) {
        return;
    }

    //终极页支付失败不弹出已完成支付浮层
    if (typeFlag == -1 && pid > 0) {
        return;
    }

    var random = new Date().getTime();
    if (is_weixin()) {
        var j_confirm_pay = new Factory({
            id: "wxPop",
            content: '<p style="text-align:center;font-size:16px;padding:5px 0;">支付确认</p><p style="text-align:left;font-size:14px;padding:10px 0;">1、请在微信内完成支付，如果您已支付成功，请点击"已完成支付"按钮。</p><p style="text-align:left;font-size:14px;padding:10px 0;">2、如果您还未安装微信6.0.2及以上版本客户端，请先安装微信或使用电脑访问豆丁网进行充值支付。</p>',
            btn: ["取消", "已完成支付"],
            title: false,
            onOk: function () {
                //判断是否支付成功还是失败
                jQuery.ajax({
                    url: "/touchPay/resultNotify_v3.do",
                    data: "pid=" + pid + "&user_id=" + uid + "&random=" + random,
                    success: function (re) {
                        var reData = JSON.parse(re);
                        if (reData.status == 1 || reData.status == -1111) {
                            window.location.href = reData.errmsg;
                        } else {
                            if (pid > 0 && typeof (rechargeConfig) != "undefined") {
                                if (rechargeConfig.ifCharge == 1 || rechargeConfig.ifCharge == 3) { //下载

                                    jQuery('<div id="pay_fail" style="position:fixed;left:0;right:0;bottom:0;top:0;height: 60px;line-height: 60px;background:rgba(50,50,50,.8);z-index:99;border-radius:5px;font-size:14px;color:#fff;text-align:center;width:70%;margin: auto;">您尚未完成支付，请重新支付</div>').appendTo(jQuery(document.body));
                                    setTimeout(function () {
                                        jQuery("#pay_fail").remove();
                                        jQuery("*[data-handel='download']").eq(0).trigger("touchend");
                                    }, 2000);

                                }

                            } else { //3秒消失
                                jQuery('<div id="pay_fail" style="position:fixed;left:0;right:0;bottom:0;top:0;height: 60px;line-height: 60px;background:rgba(50,50,50,.8);z-index:99;border-radius:5px;font-size:14px;color:#fff;text-align:center;width:70%;margin: auto;">您尚未完成支付，请重新支付</div>').appendTo(jQuery(document.body));
                                setTimeout(function () {
                                    jQuery("#pay_fail").remove();
                                }, 3000);
                            }


                        }
                    }
                });
            }
        });
    } else {
        var j_confirm_pay = new Factory({
            id: "nowxTip",
            content: '<p style="text-align:center;font-size:16px;padding:5px 0;">支付确认</p><p style="text-align:left;font-size:14px;padding:10px 0;">1.请在打开的页面进行支付.</p><p style="text-align:left;font-size:14px;padding:10px 0;">2.如支付完成,请点击“已完成支付”</p>',
            btn: ["取消", "已完成支付"],
            title: false,
            onOk: function () {
                //判断是否支付成功还是失败
                jQuery.ajax({
                    url: "/touchPay/resultNotify_v3.do",
                    data: "pid=" + pid + "&user_id=" + uid + "&random=" + random,
                    success: function (re) {
                        var reData = JSON.parse(re);
                        if (reData.status == 1) {
                            window.location.href = reData.errmsg;
                        } else {
                            if (pid > 0 && typeof (rechargeConfig) != "undefined") {
                                if (rechargeConfig.ifCharge == 1 || rechargeConfig.ifCharge == 3) { //下载
                                    jQuery('<div id="pay_fail" style="position:fixed;left:0;right:0;bottom:0;top:0;height: 60px;line-height: 60px;background:rgba(50,50,50,.8);z-index:99;border-radius:5px;font-size:14px;color:#fff;text-align:center;width:70%;margin: auto;">您尚未完成支付，请重新支付</div>').appendTo(jQuery(document.body));
                                    jQuery("*[data-handel='download']").eq(0).trigger("touchend");
                                    setTimeout(function () {
                                        jQuery("#pay_fail").remove();
                                    }, 2000);

                                }

                            } else { //3秒消失
                                jQuery('<div id="pay_fail" style="position:fixed;left:0;right:0;bottom:0;top:0;height: 60px;line-height: 60px;background:rgba(50,50,50,.8);z-index:99;border-radius:5px;font-size:14px;color:#fff;text-align:center;width:70%;margin: auto;">您尚未完成支付，请重新支付</div>').appendTo(jQuery(document.body));
                                setTimeout(function () {
                                    jQuery("#pay_fail").remove();
                                }, 2000);
                            }


                        }
                    }
                });
            }
        });
    }

}

function nobalancehandel(iData, config, buyFlag) {
    //pid:文档id pageRecord:之前浏览位置 buyFlag：2：付费3：下载
    //zhekou:1 有折扣
    if (typeof (iData) == "undefined") {
        return;
    }

    var chooseMoney = iData.arr;
    var curPayWay = iData.oldFin != 0 ? iData.oldFin : 2; //支付宝1，微信2，京东支付3
    if (is_weixin()) {
        curPayWay = 2;
    }
    var curPayAmout = 20;
    var openHref = "";
    var isBuildVip = "";
    var isBuildVipHead = "";
    var isBuildBody = '';
    if (iData.buildProduct == true) {
        if (iData.buildVip == false) {
            isBuildVip = '<p style="text-align:center;font-size:16px;padding:10px 0 0;margin-top:6px;"><a href="/jsp_cn/touch/build/build_vip.jsp?pid=' + config.pid + '" title="成为建筑会员" style="text-decoration:underline;color:#069;">&gt;&gt;成为建筑会员</a>可<span style="color:#ff0000;">免费</span>下载该文档</p>';
        } else if (iData.buildVip == true) {
            isBuildVipHead += '<ul class="pay_chose" style="padding:8px 0 16px;font-size:18px;color:#333;"><li><span class="radio selected"></span>使用下载券</li><li style="text-align:left;"><span class="radio"></span>不使用下载券</li></ul>';
            isBuildBody = '<div id="insertSlider" class="tips_con" style="display:none;"><p style="text-align:center;font-size:16px;padding:10px 0 5px;color:#333;">你当前剩余豆元：' + iData.user_price + '</p><p style="text-align:center;font-size:16px;padding:10px 0 5px;color:#333;">该文档需支付豆元：<span style="color:#ff0000;">' + iData.p_price_str + '</span>，请<span style="color:#ff0000;">充值购买</span>：</p></div>';
            if (iData.remaind_ticket >= iData.need_ticket) { //券够钱不够
                isBuildVipHead += '<div class="tips_con"><p style="text-align:center;font-size:16px;padding:10px 0;color:#333;">你当前剩余下载券：' + iData.remaind_ticket + '&nbsp;张</p><p style="text-align:center;font-size:16px;padding:10px 0;color:#333;">该文档需用下载券：<span style="color:#ff0000;">' + iData.need_ticket + '</span>&nbsp;张，要支付吗？</p></div>' + isBuildBody;
                var payWay = 0;
                var j_confirm_buy = new SliderFactory({
                    id: 'j_confirm_buy',
                    title: '确定购买么？',
                    content: isBuildVipHead,
                    padding: '12px 0',
                    footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                    onOk: function () {
                        //发请求支付
                        if (payWay == 0) {
                            jQuery.ajax({
                                url: "/touchPay/purchaseProduct_v2.do", //1：成功  -1：失败
                                data: "pid=" + config.pid + "&pageRecord=" + config.recordPage + "&dealFlag=2&isUseBuildTicket=1",
                                success: function (data) {
                                    var iData1 = JSON.parse(data);
                                    yuezuHandel(config, iData1);
                                }
                            });
                        } else if (payWay == 1) {
                            var oAmount = jQuery(".pay_val .add").data("val");
                            window.location.href = "/jsp_cn/touchPay/dispatchReq.jsp?d=touchEnd&pid=" + config.pid + "&amount=" + oAmount + "&pageRecord=" + config.recordPage + "&touch_flag=down";
                            if (is_weixin()) { //
                                weixinExpTips(config, 3);
                            }
                        }
                    },
                    footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                    method: function () {
                        var aMoneyList = jQuery(".pay_val li");
                        aMoneyList.bind("click", function () {
                            var iDataVal = jQuery(this).data("val");
                            if (iDataVal != "more") {
                                jQuery("#curMoney").val(iDataVal);
                                aMoneyList.removeClass("add");
                                jQuery(this).addClass("add");
                            } else {
                                window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&touch_flag=down&pageRecord=" + config.pageRecord;
                                aMoneyList.removeClass("add");
                            }
                        });
                        jQuery('.pay_chose li').on('click', function () {
                            var theIndex = jQuery(this).index();
                            payWay = theIndex;
                            jQuery('.pay_chose li span').removeClass('selected');
                            jQuery(this).find('span').addClass('selected')
                            jQuery('.tips_con').hide();
                            jQuery('.tips_con').eq(theIndex).show();
                            if (theIndex == 0) {
                                jQuery("#j_confirm_buy .touch_slider_footer").show();
                            } else if (theIndex == 1) {
                                jQuery("#j_confirm_buy .touch_slider_footer").hide();
                                createChongzhi();
                            }
                        });
                    }
                });
            } else { //券不够
                isBuildVipHead += '<div class="tips_con"><p style="text-align:center;font-size:16px;padding:10px 0;color:#333;">你当前剩余下载券：' + iData.remaind_ticket + '&nbsp;张</p><p style="text-align:center;font-size:16px;padding:10px 0;color:#333;">该文档需用下载券：<span style="color:#ff0000;">' + iData.need_ticket + '</span>&nbsp;张，<span style="color:#ff0000;">不足以支付</span></p></div>' + isBuildBody;
                var payWay = 0;
                var j_confirm_buy = new SliderFactory({
                    id: 'j_confirm_buy',
                    title: '确定购买么？',
                    content: isBuildVipHead,
                    buttons: ["取消", "获取下载券"],
                    padding: '12px 0',
                    footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                    onOk: function () {
                        //发请求支付
                        if (payWay == 0) {
                            window.location.href = '/jsp_cn/touch/build/build_vip.jsp?pid=' + config.pid;
                        } else if (payWay == 1) {
                            var oAmount = jQuery(".pay_val .add").data("val");
                            window.location.href = "/jsp_cn/touchPay/dispatchReq.jsp?d=touchEnd&pid=" + config.pid + "&amount=" + oAmount + "&pageRecord=" + config.pageRecord + "&touch_flag=down";
                            if (is_weixin()) { //
                                weixinExpTips(config, 3);
                            }
                        }
                    },
                    footAdd: '<p style="text-align:center;color:#b5b5b5;font-size:12px;padding:0 0 10px 0;">— 文档由' + psUserName + '上传、定价并承担法律责任。—</p>',
                    method: function () {
                        jQuery("#j_confirm_buy").addClass("build_tiket");
                        var aMoneyList = jQuery(".pay_val li");
                        aMoneyList.bind("click", function () {
                            var iDataVal = jQuery(this).data("val");
                            if (iDataVal != "more") {
                                jQuery("#curMoney").val(iDataVal);
                                aMoneyList.removeClass("add");
                                jQuery(this).addClass("add");
                            } else {
                                window.location.href = "/touchPay/otherParValue.do?pid=" + config.pid + "&touch_flag=down&pageRecord=" + config.pageRecord;
                                aMoneyList.removeClass("add");
                            }
                        });
                        jQuery('.pay_chose li').on('click', function () {
                            var theIndex = jQuery(this).index();
                            payWay = theIndex;
                            jQuery('.pay_chose li span').removeClass('selected');
                            jQuery(this).find('span').addClass('selected')
                            jQuery('.tips_con').hide();
                            jQuery('.tips_con').eq(theIndex).show();
                            if (theIndex == 0) {
                                jQuery("#j_confirm_buy").addClass("build_tiket");
                                jQuery("#j_confirm_buy .touch_slider_footer").show();
                            } else if (theIndex == 1) {
                                jQuery("#j_confirm_buy").removeClass("build_tiket");
                                jQuery("#j_confirm_buy .touch_slider_footer").hide();
                                createChongzhi();
                            }
                        });
                    }
                });
            }
            return false;

        }
    }

    function createChongzhi() {
        if (jQuery(".Jslider").length == 1) {
            return;
        }
        var sliderDiv = '<div class="Jslider" style="margin-top:15px;"><div class="money_slider"><ul class="money_items clear">';
        var layoutStr = "";
        if (chooseMoney.length != 0) {
            for (var i = 0; i < chooseMoney.length; i++) {
                var mz = chooseMoney[i].m1,
                    sz = chooseMoney[i].m2,
                    iVip = chooseMoney[i].vip == "" ? "" : '赠' + chooseMoney[i].vip + "VIP",
                    marker = '',
                    iCur = chooseMoney[i].def ? "cur" : "";
                if (chooseMoney[i].def) {
                    curPayAmout = mz;
                }
                if (iVip != "") {
                    marker = '<i></i>';
                }
                sliderDiv += '<li class="' + iCur + '"><div data-val="' + mz + '" class="money_item_wrap">' + marker + '<span class="t1">￥' + mz + '</span><span class="t2">' + sz + '豆元<br/>' + iVip + '</span></div></li>';
            }
            sliderDiv += '</ul></div>';
            jQuery(sliderDiv).appendTo(jQuery("#insertSlider"));
        }
        var touch_flag = "down";
        if (jQuery('.freeDown').find('input').length > 0) {
            var rtype = jQuery('.freeDown input:radio:checked').attr('rtype');
            if (rtype == 'payread') {
                touch_flag = "read"; //付费阅读
            } else if (rtype == 'paydown') {
                touch_flag = "down"; //下载
            }
        }
        openHref = '/jsp_cn/touchPay/pay_new.jsp?pid=' + config.pid + '&amount=' + curPayAmout + '&buy_flag=' + buyFlag + '&pay_type=' + curPayWay;
        var defaultWay = is_weixin() ? '<span class="cur_way way_weixin">微信支付</span>' : '<span class="cur_way way_' + curWayClass(curPayWay)[1] + '">' + curWayClass(curPayWay)[0] + '</span>';
        var chooseTxt = is_weixin() ? "" : '<span id="moreWay" class="way_btn">选择支付方式</span>';
        layoutStr += '<div class="payment_way way_style" style="text-align:left;">' + defaultWay + chooseTxt + '</div><div class="payment_btn"><a class="ui_btns" href="javascript:void(0);">充值并购买</a></div>';
        jQuery(layoutStr).appendTo(jQuery("#insertSlider"));
        jQuery('<li><div class="money_item_wrap"><a style="font-size:14px;height: 100%;display: block;line-height:86px;color:#000;" href="/touchPay/otherParValue.do?pid=' + config.pid + '&pageRecord=' + config.recordPage + '&touch_flag=' + touch_flag + '">其它面值</a></div></li>').appendTo(jQuery(".Jslider .money_slider ul"));
        jQuery("#moreWay").bind("touchend", function (event) {
            createLayout2(1);
            if (jQuery("#j_confirm_buy").length == 1) {
                jQuery("#wayModel .model_content").css("minHeight", jQuery("#j_confirm_buy .touch_slider_body").height() - 18);
            }
            inpmv(6523); //选择支付方式次数  11222
            return false;
        });
        jQuery("#j_confirm_buy .dialog_mask").bind("click", function () {
            closeDialog2();
        });
        jQuery(".money_items li").bind("click", function () {
            curPayAmout = jQuery(this).find("div").data("val");
            if (curPayAmout != undefined) {
                jQuery(".money_items li").removeClass("cur");
                jQuery(this).addClass("cur");
                openHref = '/jsp_cn/touchPay/pay_new.jsp?pid=' + config.pid + '&amount=' + curPayAmout + '&buy_flag=' + buyFlag + '&pay_type=' + curPayWay;
                jQuery(".payment_btn .ui_btns").prop("href", openHref);
            }
        });
        jQuery("#j_confirm_buy .payment_btn").bind("touchend", function () {
            inpmv(6526);
            if (is_weixin()) {
                weixinExpTips(config, buyFlag);
            } else {
                notWeixinPayTip(config, buyFlag);
            }
            window.location.href = openHref;
        });
    }

    function createLayout2(f) {
        var layoutStr2 = '';
        layoutStr2 += '<div id="wayModel" class="model_purchase_dialog">';
        layoutStr2 += '<div class="model_dialog"><div class="model_content"><span class="close_dialog back_step"></span>';
        var otherWay = is_weixin() ? "" : '<li data-payway="1"><span class="cur_way way_zfb">支付宝</span></li><li data-payway="3"><span class="cur_way way_jdzf">京东支付</span></li>';
        layoutStr2 += '<div class="model_head" style="margin-bottom:0;"><h4>选择支付方式</h4></div>';
        layoutStr2 += '<div class="model_body"><ul class="payment_way"><li data-payway="2"><span class="cur_way way_weixin">微信支付</span><span class="wx_tips">需6.0.2及以上客户端</span></li>' + otherWay;
        layoutStr2 += '</ul></div></div></div></div></div>';
        jQuery('body').append(layoutStr2);
        //jQuery(".model_content").css("minHeight",jQuery("#purchaseModel .model_content").height());
        jQuery("#wayModel").addClass("model_show");
        jQuery("#wayModel .close_dialog").unbind();
        jQuery("#wayModel .close_dialog").bind("touchend", function (event) {
            closeDialog2();
            if (f == undefined) {
                createLayout1();
            }
            return false;
        });
        jQuery("#wayModel .payment_way li").unbind();
        jQuery("#wayModel .payment_way li").bind("click", function () {
            curPayWay = jQuery(this).data("payway");
            openHref = '/jsp_cn/touchPay/pay_new.jsp?pid=' + config.pid + '&amount=' + curPayAmout + '&buy_flag=' + buyFlag + '&pay_type=' + curPayWay;
            jQuery(".payment_btn .ui_btns").prop("href", openHref);
            closeDialog2();
            if (f == undefined) {
                createLayout1();
            }
            jQuery("#purchaseModel .cur_way,#j_confirm_buy .cur_way").replaceWith('<span class="cur_way way_' + curWayClass(curPayWay)[1] + '">' + curWayClass(curPayWay)[0] + '</span>');
        });
    }

    function curWayClass(payFlag) {
        var wayStr = "",
            wayClass = "";
        if (payFlag == "2") {
            wayStr = '微信支付';
            wayClass = 'weixin';
        } else if (payFlag == "1") {
            wayStr = '支付宝';
            wayClass = 'zfb';
        } else if (payFlag == "3") {
            wayStr = '京东支付';
            wayClass = 'jdzf';
        }
        return [wayStr, wayClass];
    }

    function createLayout1() {
        if (jQuery("#purchaseModel").length == 1) {
            jQuery("#purchaseModel").addClass("model_show");
            return;
        }
        var zhekouStr = zhekouPrice = iTxt = "";
        if (iData.disCountProduct) { //有折扣
            zhekouStr = '<span class="off_nine">9折</span>';
            zhekouPrice = '<span style="color:#ff0000;">' + (iData.p_price_str * 0.9).toFixed(2) + '</span><del style="color:#cacaca;padding-left:5px;" >' + iData.p_price_str + '</del>';
            iTxt = '<br/>文档需支付豆元：';
        } else {
            var zhekouPrice = '<span style="color:#ff0000;">' + iData.p_price_str + '</span>';
            iTxt = '&nbsp;&nbsp;&nbsp;&nbsp;文档需支付豆元：';
        }
        var layoutStr = '';
        layoutStr = '<div id="purchaseModel" class="model_purchase_dialog"><div class="dialog_mask"></div>';
        layoutStr += '<div class="model_dialog"><div class="model_content"><span class="close_dialog"></span>';
        layoutStr += '<div class="model_head"><h4>您的余额不足，请充值后购买</h4>' + isBuildVip + '<div class="account_balance">您的余额：<span class="fcr">' + iData.user_price + '</span>' + iTxt + '<span class="fcr">' + zhekouStr + zhekouPrice + '</span></div></div>';
        var sliderDiv = '<div class="Jslider"><div class="money_slider"><ul class="money_items clear">';
        if (chooseMoney.length != 0) {
            for (var i = 0; i < chooseMoney.length; i++) {
                var mz = chooseMoney[i].m1,
                    sz = chooseMoney[i].m2,
                    iVip = chooseMoney[i].vip == "" ? "" : '赠' + chooseMoney[i].vip + "VIP",
                    marker = '',
                    iCur = chooseMoney[i].def ? "cur" : "";
                if (chooseMoney[i].def) {
                    curPayAmout = mz;
                }
                if (iVip != "") {
                    marker = '<i></i>';
                }
                sliderDiv += '<li class="' + iCur + '"><div data-val="' + mz + '" class="money_item_wrap">' + marker + '<span class="t1">￥' + mz + '</span><span class="t2">' + sz + '豆元<br/>' + iVip + '</span></div></li>';
            }
        }
        var touch_flag = "down";
        if (jQuery('.freeDown').find('input').length > 0) {
            var rtype = jQuery('.freeDown input:radio:checked').attr('rtype');
            if (rtype == 'payread') {
                touch_flag = "read"; //付费阅读
            } else if (rtype == 'paydown') {
                touch_flag = "down"; //下载
            }
        }
        openHref = '/jsp_cn/touchPay/pay_new.jsp?pid=' + config.pid + '&amount=' + curPayAmout + '&buy_flag=' + buyFlag + '&pay_type=' + curPayWay;
        var defaultWay = is_weixin() ? '<span class="cur_way way_weixin">微信支付</span>' : '<span class="cur_way way_' + curWayClass(curPayWay)[1] + '">' + curWayClass(curPayWay)[0] + '</span>';
        var chooseTxt = is_weixin() ? "" : '<span id="moreWay" class="way_btn">选择支付方式</span>';
        layoutStr += '<div class="model_body">' + sliderDiv + '</ul></div>';
        layoutStr += '<span class="btn_arrow btn_left"></span><span class="btn_arrow btn_right"></span></div>';
        layoutStr += '<div class="payment_way way_style">' + defaultWay + chooseTxt + '</div><div class="payment_btn"><a class="ui_btns" href="javascript:void(0);">充值并购买</a></div>';
        layoutStr += '</div></div></div></div>';
        jQuery('body').append(layoutStr);
        jQuery('<li><div class="money_item_wrap"><a style="font-size:14px;height: 100%;display: block;line-height:86px;color:#000;" href="/touchPay/otherParValue.do?pid=' + config.pid + '&pageRecord=' + config.recordPage + '&touch_flag=' + touch_flag + '">其它面值</a></div></li>').appendTo(jQuery("#purchaseModel .money_slider ul"));
        jQuery("#purchaseModel .close_dialog").bind("touchend", function (event) {
            closeDialog1();
            return false;
        });
        jQuery("#purchaseModel .dialog_mask").bind("touchend", function (event) {
            closeDialog1();
            closeDialog2();
            return false;
        });
        jQuery("#moreWay").bind("touchend", function (event) {
            createLayout2();
            jQuery(".model_content").css("minHeight", jQuery("#purchaseModel .model_content").height());
            inpmv(6523); //选择支付方式次数  11222
            return false;
        });
        jQuery(".money_items li").bind("click", function () {
            curPayAmout = jQuery(this).find("div").data("val");
            if (curPayAmout != undefined) {
                jQuery(".money_items li").removeClass("cur");
                jQuery(this).addClass("cur");
                openHref = '/jsp_cn/touchPay/pay_new.jsp?pid=' + config.pid + '&amount=' + curPayAmout + '&buy_flag=' + buyFlag + '&pay_type=' + curPayWay;
                jQuery(".payment_btn .ui_btns").prop("href", openHref);
            }

        });
        jQuery(".payment_btn").bind("touchend", function () {
            inpmv(6526);
            if (is_weixin()) {
                weixinExpTips(config, buyFlag);
            } else {
                notWeixinPayTip(config, buyFlag);
            }
            window.location.href = openHref;
        });
        setTimeout(function () {
            jQuery("#purchaseModel").addClass("model_show");
        }, 300);
        inpmv(6522); //余额不足展示数
    }

    createLayout1();

    //stop();
    function closeDialog1() {
        jQuery("#purchaseModel").removeClass("model_show");
        jQuery("#purchaseModel").remove();
        inpmv(6524);
    }

    function closeDialog2() {
        jQuery("#wayModel").remove();
    }
}

function bodyscroll(e) {
    e.preventDefault();
}

function stopMove() {
    jQuery('html').css({
        'height': '100%',
        'overflow': 'hidden'
    });
    document.body.addEventListener('touchmove', bodyscroll, {
        passive: false
    });
}

function startmove() {
    jQuery('html').css({
        'height': 'auto',
        'overflow': 'initial'
    });
    document.body.removeEventListener('touchmove', bodyscroll, {
        passive: false
    });
}

function testStart() {
    jQuery('html').css({
        'height': 'auto',
        'position': 'static'
    });
}

function testStop() {
    jQuery('html').css({
        'height': '100%',
        'position': 'fixed'
    });
}

// add new weixin broswer quick payment
function createQuickpayment(data, configObj, buyFlag) {
    console.log(data);
    if (typeof (data) == "undefined") {
        return;
    }
    var temp_price_arr = JSON.parse(data.data.need_money_str),
        doc_price = data.data.p_price.toFixed(2);
    var zhekouStr = "",
        zhekouPrice = "";
    if (data.discountProduct) {
        //有折扣
        zhekouStr = '<span class="off_nine">9折</span>';
        zhekouPrice = '<span style="color:#ff0000;">' + (doc_price * 0.9).toFixed(2) + '</span><del style="color:#cacaca;padding-left:5px;" >' + doc_price + '</del>';
    } else {
        // 没折扣
        zhekouStr = "";
        zhekouPrice = doc_price;
    }
    var quickStr = '<div id="onlyWx-purchase"><div class="onlyWx-purchase-mask"></div><div class="onlyWx-purchase-content"><div class="onlyWx-purchase-content-head"><span class="close-purchase-mask"></span><div class="onlyWx-purchase-title"><span class="purchase-title-item cur">快捷支付下载</span><span class="purchase-title-item">登录下载</span></div></div><div class="onlyWx-purchase-body"><div class="onlyWx-purchase-content-main"><p>该文档需支付豆元：' + zhekouStr + '<span class="onlyWx-purchase-money">' + zhekouPrice + '</span></p><ul>',
        payAmount = 0,
        moneyItem = '';
    for (var j = 0; j < temp_price_arr.length; j++) {
        var yuan = temp_price_arr[j].m1,
            douyuan = temp_price_arr[j].m2,
            ifVip = temp_price_arr[j].vip == "" ? "" : '赠' + temp_price_arr[j].vip + "VIP",
            deff = temp_price_arr[j].def ? 'onlyWx-purchase-choices-cur' : '',
            ifIco = '';
        if (deff) {
            payAmount = temp_price_arr[j].m1;
        }
        if (ifVip != '') {
            ifIco = '<span class="ico-free-vip"></span>';
        }
        moneyItem += '<li class="onlyWx-purchase-choices ' + deff + '">' + ifIco + '<p class="onlyWx-purchase-one">￥<span class="purchase-choices-money-top">' + yuan + '</span></p><p class="onlyWx-purchase-two"><span class="purchase-choices-money-bottom">' + douyuan + '</span>豆元<br/>' + ifVip + '</p></li>';
    }
    quickStr += moneyItem;
    var payUrl = '/jsp_cn/my/fin/login/touch/login_code_pay_touch.jsp?amount=' + payAmount + '&pid=' + configObj.pid;
    quickStr += '</ul></div><div class="onlyWx-purchase-content-foot payment_btn"><a href="javascript:void(0);" class="ui_btns addMoneybuy">充值并购买</a><p>购买成功微信即为豆丁账号，可随时用微信登录豆丁</p></div></div></div></div>';
    jQuery('body').append(quickStr);
    inpmv(6768);
    if (jQuery('#onlyWx-purchase').length == 1) {
        jQuery(this).addClass('onlyWx-purchase-show');
    }
    jQuery('.purchase-title-item').off('click').on('click', function () {
        jQuery(this).addClass('cur').siblings().removeClass('cur');
        if (jQuery(this).html() == '登录下载') {
            inpmv(6760);
            // 执行登录
            setCookie2008_1("html_down_key", "touch_html_end_value_down");
            showLogin(null, 0, "pageRecord=" + configObj.recordPage);
        } else {
            jQuery('.onlyWx-purchase-body').show();
        }
    })
    jQuery('.onlyWx-purchase-choices').off('click').on('click', function () {
        jQuery(this).addClass('onlyWx-purchase-choices-cur').siblings().removeClass('onlyWx-purchase-choices-cur');
        var tempMoney = jQuery(this).find('.purchase-choices-money-top').html();
        payUrl = '/jsp_cn/my/fin/login/touch/login_code_pay_touch.jsp?amount=' + tempMoney + '&pid=' + configObj.pid;
    })
    jQuery('.addMoneybuy').off('touchend').on('touchend', function () {
        inpmv(6761);
        closeQuickpayment();
        weixinExpTips(configObj, buyFlag);
        window.location.href = payUrl;
    })
    jQuery('.close-purchase-mask').off('touchend').on('touchend', closeQuickpayment);
    jQuery('.onlyWx-purchase-mask').off('touchend').on('touchend', closeQuickpayment);

    function closeQuickpayment(event) {
        stopBubble(event);
        jQuery('#onlyWx-purchase').removeClass('onlyWx-purchase-show');
        jQuery('#onlyWx-purchase').remove();
        inpmv(6762);
        return false;
    }

    function stopBubble(event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
    }

    setTimeout(function () {
        jQuery('#onlyWx-purchase').addClass('onlyWx-purchase-show');
    }, 300);
}

var touchFun = {
    touchFunInit: function () {
        var _this = this;
        //alert("1313"+":::"+window.screen.availHeight);
        _this.miniScreen = window.screen.height > 480 ? true : false;
        _this.initSearch(); //初始化搜索
        _this.openChannel(); //打开频道导航
        _this.backStep(); //f返回上一步
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
                //stopMove();
                inpmv(4978); //首页搜索框点击量
                return false;
            });
        }
        // if (oDefaultCross.length > 0) {
        // 	oDefaultCross.bind("touchcancel", function (event) {
        // 		_this.createSearchPage(1); //打开搜索page

        // 		return false;
        // 	});
        // }
        var searchClick = typeof (rechargeConfig) != "undefined" ? 6607 : 6612;

        var oEndHeaderSearch = jQuery(".m-header-top .toolbar_search");
        if (oEndHeaderSearch.length > 0) {
            var oBlackSearch = oEndHeaderSearch.find(".ico_btn_black_search");
            if (oBlackSearch.length == 0) {
                oEndHeaderSearch.bind("click", function () {
                    _this.createSearchPage();
                    //stopMove();
                    // test
                    // testStop();
                    inpmv(searchClick); //终极页的“搜索图标”点击量
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
                var iIndex = jQuery(this).data("index");
                jQuery.post("/touch_new/remove_search_history.do?index=" + iIndex); //参数为0，删除单条记录
            })
        }
        if (oHistoryDelete.length > 0) {
            oHistoryDelete.bind("click", function () {
                jQuery(this).parent().parent().remove();
                jQuery.post("/touch_new/remove_search_history.do?index=-1"); //参数为-1，删除全部记录
            })
        }
    },
    openChannel: function () {
        var oShowNavlistBtn = jQuery(".toolbar_more"),
            oToolHeadTop = jQuery(".m-header-top");
        if (oShowNavlistBtn.length > 0 && oToolHeadTop.length > 0) {
            jQuery(".m-header-top .header_nav_list").addClass("headerBg");
            var oNavListHeight = "130px"; //100

            var oHeaderHeight = "173px"; //173
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
        var clickId = 6610;
        var searchUrl = "/touch_new/search.do";
        if (typeof (rechargeConfig) != "undefined") {
            searchTxt = '你是否想搜';
            clickId = 6608;
        }
        var oSearchWrap = jQuery('<div class="m-search-full"></div>');
        var oSearchSection = jQuery('<section class="m-search-page"></section>');
        var oSearchInput = jQuery('<div class="m-search-header"></div>');
        var strInput = '<div class="header-searchInput"><form  method="get" onsubmit="return check_v1()" action="' + searchUrl + '"><input placeholder="搜索文档或关键词" type="search" autocomplete="off" class="search-input" baidusug="2" id="search" value="' + searchWord + '"><i class="ico_ui ico_btn_search"></i><i id="cross" class="cross" style="display: none;"></i></form></div>';
        strInput += '<div class="header-searchBtn"><a id="search-cancel" href="javascript:void(0);">取消</a></div>';
        var idailyHot = '<div class="header-search-hot" ontouchend="return inpmv(' + clickId + ');"><div class="search-tit"><h4>' + searchTxt + '</h4></div><div class="bd" id="search_hot"></div></div>';
        var ihistory = '<div class="header-search-history" ontouchend="return inpmv(6609);"><div class="search-tit"><h4>历史搜索</h4><span class="ico_btn_delete"></span></div><div class="bd"><ul id="search_history"></ul></div></div>';
        oSearchInput.append(strInput);
        oSearchSection.append(oSearchInput);
        oSearchSection.append(idailyHot);
        oSearchSection.append(ihistory);
        oSearchWrap.append(oSearchSection);
        oSearchWrap.appendTo(document.body);
        jQuery("#search").val(searchWord);
        LoadJS(picture_image_path_v1 + "/js/opensearchsug.js?rand=201905126", 1);
        _this.clickSearchHandel();
        _this.getSearchData();
    },
    getSearchData: function () { //f:1非终极页搜索  f:2终极页搜索
        var _this = this;
        var iUrl = '/touch_new/ajax_search_layer.do';
        if (typeof (isBuild) != "undefined" && isBuild == true) {
            iUrl = "/touch_new/ajax_search_layer_build.do";
        }
        var iData = {};
        var aHot = aHis = "";
        if (typeof (rechargeConfig) != "undefined") { //区分是终极页搜索
            var pidName = jQuery(".header-toolbar-title").html();
            iData = {
                'isEnd': 'true',
                'productName': pidName
            }
            aHot = '<a href="/touch_new/search.do?rkey=' + iData.productName + '">' + iData.productName + '</a>';
            if (rechargeConfig.isBuildProduct) {
                aHot = '<a href="/touch_new/search.do?rkey=' + iData.productName + '&isBuild=true">' + iData.productName + '</a>';
            }
        }
        var buildPrama = "";
        if ((typeof (isBuild) != "undefined" && isBuild == true) || (typeof (rechargeConfig) != "undefined" && rechargeConfig.isBuildProduct == true)) {
            buildPrama = "&isBuild=true";
        }
        jQuery.ajax({
            type: "GET",
            url: iUrl,
            cache: false,
            data: iData,
            success: function (data, textStatus) {
                var myData = data;
                var returnHotData = myData.resultList,
                    returnHistoryData = myData.searchHistory;
                if (returnHotData.length > 0) {
                    for (var i = 0; i < returnHotData.length; i++) {
                        aHot += '<a href="/touch_new/search.do?rkey=' + returnHotData[i] + buildPrama + '">' + returnHotData[i] + '</a>';
                    }
                    jQuery("#search_hot").append(aHot);
                }
                if (returnHistoryData.length > 0) {
                    for (var j = 0; j < returnHistoryData.length; j++) {
                        aHis += '<li><a href="/touch_new/search.do?rkey=' + returnHistoryData[j] + buildPrama + '">' + returnHistoryData[j] + '</a><span data-index=' + j + ' class="ico_btn_remove"></span></li>';
                    }
                    jQuery("#search_history").append(aHis);
                } else {
                    jQuery(".header-search-history").remove();
                }


                _this.bindMethod();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
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
            } else {
                jQuery("#cross").hide();
            }
        });
        jQuery("#cross").bind("click", function () {
            oRealSearch.val("");
            oRealSearch.focus();
            jQuery("#cross").hide();
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
        });
        oRealSearch.bind("keydown", function (event) {
            if (event.keyCode == 13) {
                submitTo1();
                inpmv(5913);
                return false;
            }
        });
    }
};
touchFun.touchFunInit();

(function () {
    //豆丁书房app推广
    if (jQuery("#closeAppRecom").length == 1) {
        jQuery("#closeAppRecom").bind("click", function () {
            setCookie2008_1('appTipVisited', '1', 365);
            jQuery("#indexAppRecom").hide();
        });
    }
})();
//add new 建筑会员到期优化
// 建筑会员到期优化
function buildVipDeadline(status1, status2, urlPrefix) {
    var $width = jQuery(window).width();
    // status1 下载券是否用完  status2 会员是否到期
    if (status1 == true) {
        var tempStr = '';
        // 兼容医疗 rem
        if ($width <= 320) {
            // 小屏手机
            tempStr = '下载券没啦！限时享';
        } else {
            // 正常手机
            tempStr = '下载券用完啦！立即获取下载券可享';
        }
        var tempHtml = '<div class="slideBox-mob"><a href="javascript:;" class="slideBox-mob-close"><svg t="1568625037451" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1112" width="9" height="9"><path d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z" p-id="1113" fill="#231916"></path></svg></a><p>' + tempStr + '<span>8折</span>优惠</p><a href="' + urlPrefix + '/jsp_cn/touch/build/build_vip.jsp?&d=1" class="slideBox-mob-buy">立即续费</a></div>';
        jQuery('body').append(tempHtml);
        requestDeadline2();
    }
    if (status2 == true) {
        var tempStr = '';
        // 兼容医疗 rem
        if ($width <= 320) {
            // 小屏手机
            tempStr = '会员到期啦！限时享';
        } else {
            tempStr = '会员到期啦！立即获取下载券可享';
        }
        var tempHtml = '<div class="slideBox-mob"><a href="javascript:;" class="slideBox-mob-close"><svg t="1568625037451" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1112" width="9" height="9"><path d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z" p-id="1113" fill="#231916"></path></svg></a><p>' + tempStr + '<span>8折</span>优惠</p><a href="' + urlPrefix + '/jsp_cn/touch/build/build_vip.jsp?&d=1" class="slideBox-mob-buy">立即续费</a></div>';
        jQuery('body').append(tempHtml);
        requestDeadline1();
    }
    if (jQuery('.slideBox-mob').length >= 1) {
        //终极页
        if (jQuery('.func-bar-ft').length >= 1) {
            jQuery('.slideBox-mob').css('bottom', '54px');
        } else if (jQuery('.miniFooter').length == 1) {
            var $height = jQuery('.miniFooter').outerHeight();
            jQuery('.slideBox-mob').css('bottom', $height + 'px');
        } else {
            jQuery('.slideBox-mob').css('bottom', '44px');
        }
        jQuery('.slideBox-mob-close').off('click').on('click', function () {
            jQuery('.slideBox-mob').remove();
        })
    }
}

function requestDeadline2() {
    jQuery.ajax({
        url: '/touchPay/removeModalCache.do?p=2',
        success: function () {
            // 请求成功
        },
        error: function () {
            // 请求出错
        }
    })
}

function requestDeadline1() {
    jQuery.ajax({
        url: '/touchPay/removeModalCache.do?p=1',
        success: function () {
            // 请求成功
        },
        error: function () {
            // 请求出错
        }
    })
}

function qqkefuCopyData() { //flag 1:终极页 2：建筑会员 3：账单页
    var oQQkfBtn = jQuery(".doc-qq-vip,.doc-qq,.toolbar_qqkefu,#contactQQ");
    if (oQQkfBtn.length == 0) {
        return;
    }
    var qqHref = oQQkfBtn.data("qqhref");
    var flag = 1;
    if (qqHref == undefined) {
        flag = 2;
        qqHref = "https://url.cn/54302mK?_type=wpa&qidian=true ";
    }
    oQQkfBtn.bind("click", function () {
        jQuery.ajax({
            type: "GET",
            async: false,
            url: "/jsp_cn/api/qqservice.jsp",
            success: function (res) {
                var re = JSON.parse(res);
                if (re.state == -1) {
                    var userId = "NULL";
                    var dealCode = "NULL";
                    var dealDate = "NULL";
                    if (typeof (rechargeConfig) != 'undefined') {
                        var iHref = 'https://www.docin.com/p-' + rechargeConfig.pid + '.html';
                        var copyStr = '文档地址：' + iHref + '\n用户Userid：' + userId;
                    } else if (flag == 2) { //qq在线客服
                        var copyStr = '用户Userid：' + userId + '\n最近一次的充值交易号：' + dealCode + ',交易日期：' + dealDate;
                    }
                    console.log(copyStr);
                    copyTips(); //复制成功提示粘贴
                    copyToClipboard('.doc-qq-vip,.doc-qq,.toolbar_qqkefu', copyStr);
                    setTimeout(function () {
                        window.open(qqHref);
                    }, 500);
                } else if (re.state == 1) { //买过
                    if (qqHref == undefined) {
                        if (re.isVIP) {
                            qqHref = "https://url.cn/5c2jdaX?_type=wpa&qidian=true";
                        } else {
                            qqHref = "https://url.cn/54302mK?_type=wpa&qidian=true";
                        }
                    }
                    var copyStr = "";
                    if (typeof (rechargeConfig) != 'undefined') {
                        var iHref = 'https://www.docin.com/p-' + rechargeConfig.pid + '.html';
                        var userId = rechargeConfig.userId;
                        var dealCode = re.user_bank_transaction_id;
                        var dealDate = re.date;
                        copyStr = '文档地址：' + iHref + '\n用户Userid：' + userId + '\n最近一次的充值交易号：' + dealCode + ',交易日期：' + dealDate;
                    } else if (flag == 2) {
                        var userId = re.user_id;
                        var dealCode = re.user_bank_transaction_id;
                        var dealDate = re.date;
                        if (typeof (buildVipData) != "undefined") {
                            var isBuildVip = buildVipData.isVip == "true" ? "会员类型：建筑会员(已开通)" : "会员类型：建筑会员(未开通)";
                            var bulidVipEndDate = buildVipData.isVip == "true" ? "\n会员截止日期：" + buildVipData.buildVipEnd : "";
                            copyStr = isBuildVip + bulidVipEndDate + '\n用户Userid：' + userId + '\n最近一次的充值交易号：' + dealCode + ',交易日期：' + dealDate;
                        } else {
                            copyStr = '用户Userid：' + userId + '\n最近一次的充值交易号：' + dealCode + ',交易日期：' + dealDate;
                        }
                    }
                    console.log(copyStr);
                    copyTips(); //复制成功提示粘贴
                    copyToClipboard('.doc-qq-vip,.doc-qq,.toolbar_qqkefu', copyStr);
                    setTimeout(function () {
                        window.open(qqHref);
                    }, 500);
                } else if (re.state == 0) { //已登录的没买过
                    if (qqHref == undefined) {
                        if (re.isVIP) {
                            qqHref = "https://url.cn/5c2jdaX?_type=wpa&qidian=true";
                        } else {
                            qqHref = "https://url.cn/54302mK?_type=wpa&qidian=true";
                        }
                    }
                    var copyStr = "";
                    if (typeof (rechargeConfig) != 'undefined') {
                        var iHref = 'https://www.docin.com/p-' + rechargeConfig.pid + '.html';
                        var userId = rechargeConfig.userId;
                        var dealCode = "NULL";
                        var dealDate = "NULL";
                        copyStr = '文档地址：' + iHref + '\n用户Userid：' + userId + '\n最近一次的充值交易号：' + dealCode + ',交易日期：' + dealDate;
                    } else if (flag == 2) {
                        var userId = re.user_id;
                        var dealCode = "NULL";
                        var dealDate = "NULL";
                        if (typeof (buildVipData) != "undefined" && buildVipData.isVip == "false") { //建筑vip
                            var vipType = "会员类型：建筑会员(未开通)";
                            copyStr = vipType + '\n用户Userid：' + userId + '\n最近一次的充值交易号：' + dealCode + ',交易日期：' + dealDate;
                        } else { //账单页 联系客服
                            copyStr = '用户Userid：' + userId + '\n最近一次的充值交易号：' + dealCode + ',交易日期：' + dealDate;
                        }
                    }
                    copyTips(); //复制成功提示粘贴
                    console.log(copyStr);
                    copyToClipboard('.doc-qq-vip,.doc-qq,.toolbar_qqkefu', copyStr);
                    setTimeout(function () {
                        window.open(qqHref);
                    }, 500);
                }

            }
        });
    });

    function copyTips() {
        if (jQuery("#copyQQTips").length > 0) {
            jQuery("#copyQQTips").remove();
        }
        clearTimeout(hideTimer);
        jQuery('<div id="copyQQTips" style="position:fixed;bottom:98px;height:36px;line-height:36px;background:rgba(50,50,50,.8);z-index:99;border-radius:5px;font-size:14px;color:#fff;text-align:center;padding:0 15px;z-index:1001;"><span>文档信息已复制，粘贴给客服咨询</span></div>').appendTo(jQuery(document.body));
        var oMarginL = -jQuery("#copyQQTips").outerWidth() / 2;
        jQuery("#copyQQTips").css({
            "margin-left": oMarginL + "px",
            "left": "50%"
        });
        hideInSecond("copyQQTips", 3);
    }
}