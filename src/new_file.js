(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;
				if (!u && a) return a(o, !0);
				if (i) return i(o, !0);
				throw new Error("Cannot find module '" + o + "'");
			}
			var f = n[o] = {
				exports: {}
			};
			t[o][0].call(f.exports, function(e) {
				var n = t[o][1][e];
				return s(n ? n : e)
			}, f, f.exports, e, t, n, r)
		}
		return n[o].exports
	}
	var i = typeof require == "function" && require;
	for (var o = 0; o < r.length; o++) s(r[o]);
	return s
})({
	1: [function(require, module, exports) {
		var Http = require("../../plugins/modules/http/httpV2.js");
		var urlParam = require("../../plugins/urlParam.js");
		var moSwitch = require("../../plugins/moSwitch.js");
		var nsLcpAdsMod = {
			url: {
				getAdsApi: "//mapi.vip.com/vips-mobile/rest/activity/pc/adver/list/get"
			},
			adsConfig: {},
			zoneIdsArr: [],
			init: function() {
				this.bindEventListeners();
				moSwitch.getSwitch("1230").then(function(data) {
					var switchStatus = true;
					data = data || [];
					for (var i = 0, len = data.length; i < len; i++)
						if (data[i].switchId.toString() == "1230" && data[i].status == 0)
							switchStatus = false;
					$.Listeners.pub("get.lcp.switchStatus").success({
						switchStatus: switchStatus
					})
				})
			},
			bindEventListeners: function() {
				var _this = this;
				$.Listeners.sub("config.pcapiToLcp").onsuccess(function(data) {
					for (var i in data.adsConfig) {
						_this.adsConfig[i] = data.adsConfig[i];
						_this.zoneIdsArr.push(i)
					}
				});
				$.Listeners.sub("get.lcp.switchStatus").onsuccess(function(data) {
					if (data.switchStatus) _this.getAdsAjax();
					else $.Listeners.pub("get.pcapiAds.list").success()
				})
			},
			getAdsAjax: function(adsConfig) {
				var zoneIdsArr = [];
				var adsConfig = adsConfig || this.adsConfig;
				for (var i in adsConfig) {
					this.adsConfig[i] = adsConfig[i];
					zoneIdsArr.push(i)
				}
				var _this = this,
					dtd = $.Deferred(),
					params = urlParam.get({
						standby_id: "nature",
						area_id: $.Cookie.get("vip_province") || "104104",
						zone_ids: zoneIdsArr.join(",")
					});
				if (window.VIPTE && (VIPTE.INDEX && (VIPTE.INDEX.preview == 1 && (VIPTE.INDEX
						.preview_date_from != "" && VIPTE.INDEX.preview_time_from != "")))) {
					var getDate = VIPTE.INDEX.preview_date_from + " " + VIPTE.INDEX
						.preview_time_from;
					getDate = getDate.replace(/-/g, "/");
					var timestamp = (new Date(getDate)).getTime();
					params.previewMode = 1;
					params.previewTime = parseInt(timestamp /
						1E3)
				}
				Http({
					url: this.url.getAdsApi,
					data: params,
					jsonp: "callback",
					jsonpCallback: "lcpAdsCb" + (new Date).getTime() + "_" + Math.floor(Math
						.random() * 1E6),
					dataType: "jsonp",
					cache: true,
					timeout: 8E3,
					ajaxTryTimes: 1,
					code: "lcpAds_ajax_err",
					successCallback: function(re) {
						if (re.code == 1 && (re.data && re.data.map)) {
							var adsData = _this.dataProcess(re.data.map);
							$.Listeners.pub("get.lcpAds.success").success(adsData);
							dtd.resolve(adsData)
						} else dtd.reject()
					},
					errorCallback: function() {
						dtd.reject()
					}
				});
				return dtd.promise()
			},
			dataProcess: function(data) {
				var tempData = {};
				for (var i in data) {
					tempData[this.adsConfig[i]] = {
						items: []
					};
					for (var j = 0, len = data[i].length; j < len; j++) tempData[this.adsConfig[i]]
						.items.push({
							aid: data[i][j].bannerid,
							blank: data[i][j].blank,
							exptype: data[i][j].exptype,
							height: data[i][j].height,
							id: data[i][j].zone_id,
							img: data[i][j].imgFullPath.replace(/^http:|https:/i, ""),
							link: data[i][j].url.replace(/^http:|https:/i, ""),
							name: data[i][j].name,
							width: data[i][j].width
						})
				}
				return tempData
			}
		};
		module.exports = nsLcpAdsMod
	}, {
		"../../plugins/moSwitch.js": 22,
		"../../plugins/modules/http/httpV2.js": 27,
		"../../plugins/urlParam.js": 30
	}],
	2: [function(require, module, exports) {
		require("./modules/capslock.js");
		require("./modules/placeholder.js");
		require("../../plugins/md5.js");
		var AD = require("./modules/ads.js");
		var AccountRisk = require("./modules/accoun-trisk.js");
		var getQrImg = require("./modules/get-qr-img");
		var mars = require("./modules/mars.js");
		var marsCid = require("./modules/marsCid.js");
		var fakeA = require("../../plugins/modules/FakeA");
		var loginPageMars = require("../../plugins/modules/LoginPageMars");
		var LoginType =
			loginPageMars.config.loginType;
		var SecureCode = require("./modules/SecureCode/index");
		var mobileValidation = require("../../plugins/modules/validate/mobile").mobileValidation;
		var Countdown = require("./modules/Countdown");
		var marsTracker = require("@vmr/mars_sdk_web");
		var PasswordRules = require("./modules/password-rules.js");
		var getDataFromFpData = require("./modules/SecureCode/getDataFromFpData");
		var switchEncrypt = require("../../plugins/switchEncrypt");
		var ajaxHelper = require("../../plugins/ajax");
		require("../../plugins/compact.js").init();

		function initSecureCode(options) {
			var captchaData = options.captchaData;
			if (!captchaData) return;
			return new SecureCode({
				captchaId: captchaData.captchaId,
				templateId: captchaData.templateId + "?v=" + Date.now(),
				captchaType: captchaData.captchaType,
				extend: {},
				targetId: options.targetId,
				container: options.container,
				onShow: function(captchaInstance) {
					options.onShow && options.onShow(captchaInstance)
				},
				onPassed: function(res) {
					options.onPassed && options.onPassed(res)
				}
			})
		}
		window.Tool = {
			data: {
				rootPath: "https://passport.vip.com",
				isEncrypt: false
			},
			ui: {
				init: function() {
					this.whereFrom()
				},
				simpleDialog: function(msg) {
					return $.Dialog({
						model: true,
						opacity: 0.5,
						size: "small",
						content: msg || "",
						button: [{
							type: "default",
							text: "\u5173\u95ed",
							size: "medium",
							event: function() {
								this.remove()
							},
							closeEvent: function() {
								this.remove()
							}
						}]
					}).open()
				},
				whereFrom: function() {
					if (config.whereFrom === "vipsfin") {
						$(".J_vpal_checkbox_model").removeClass(config.status.hidden);
						$(".J_mobile_login_checkbox_model").removeClass(config.status.hidden)
					}
				},
				capslock: function(isCapslock) {
					config.jqCapslockTip[isCapslock ?
						"addClass" : "removeClass"](config.status.isShowTooltips)
				}
			},
			smsCaptchaFlow: {
				preCheck: function(captchaTicket, captchaId) {
					$("#J_verify_sms_load_fail").addClass("f-hide");

					function handleSmsData(rtn) {
						if (Number(rtn.code) === 200) {
							var data = rtn.data || {};
							Tool.module.data.mobileLoginPid = data.pid;
							if (Number(data.passportType) === 2) Tool.module.data
								.needShowPasswordPanel = true;
							else if (Number(data.passportType) === 1) Tool.module.data
								.needShowPasswordPanel = data.setPwd === false;
							Tool.module.data.setPwd = data.setPwd;
							Tool.module.data.passportType =
								data.passportType;
							if (data && data.smsCaptchaFlowData) {
								var smsFlowData = data.smsCaptchaFlowData;
								if (smsFlowData.captchaId && (smsFlowData.templateId && smsFlowData
										.captchaType)) {
									var _extend = {};
									if (smsFlowData.extend) try {
										_extend = JSON.parse(smsFlowData.extend)
									} catch (e) {}
									var flowConfig = {
										vscConfig: {
											captchaId: smsFlowData.captchaId,
											templateId: smsFlowData.templateId + "?v=" + Date
												.now(),
											captchaType: smsFlowData.captchaType,
											extend: _extend
										},
										mobile: Tool.module.getInputPhone(),
										targetId: (config.jqSmsCaptchaComp.selector || "")
											.substring(1)
									};
									Tool.smsCaptchaFlow.initCaptcha(flowConfig)
								}
							} else {
								Tool.smsCaptchaFlow.showSystemError(
									"\u7ec4\u4ef6\u521d\u59cb\u5316\u53c2\u6570\u5f02\u5e38\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u624b\u673a\u53f7"
									);
								config.jqMobileLoginPhone.val("")
							}
						} else Tool.smsCaptchaFlow.showSystemError(rtn)
					}
					var initUrl = Tool.data.rootPath + "/mobileLogin/v2/initSmsFlow";
					var initParams = {
						mobile: Tool.module.getInputPhone(),
						fpData: getDataFromFpData()
					};
					if (captchaTicket && captchaId) {
						initParams.captchaTicket = captchaTicket;
						initParams.captchaId =
							captchaId
					}
					ajaxHelper.req({
						type: "POST",
						url: initUrl,
						dataType: "json",
						data: initParams,
						isEncrypt: Tool.data.isEncrypt,
						Authorization: "pc",
						cache: false
					}).done(function(data) {
						handleSmsData(data)
					}).fail(function(rtn) {
						Tool.smsCaptchaFlow.initSmsFlowError(rtn)
					})
				},
				handleCaptchaFlowData: function(rtn) {
					var captchaData = rtn.data.captchaFlowData;
					initSecureCode({
						captchaData: captchaData,
						targetId: Tool.module.UI.captchaV2.substring(1),
						container: Tool.module.UI.captchaContainerV2,
						onShow: function(captchaInstance) {
							Tool.module.resizeIframe();
							Tool.smsCaptchaFlow.cleanCaptcha();
							Tool.module.data.instance = captchaInstance
						},
						onPassed: function(res) {
							var ticket = res && (res.data && res.data.ticket) || "";
							$(Tool.module.UI.captchaContainerV2).addClass("f-hidden");
							Tool.smsCaptchaFlow.preCheck(ticket, captchaData.captchaId)
						}
					})
				},
				initSmsFlowError: function(rtn) {
					var loginError = {
						500: [config.jqMobileLoginPhone,
							"\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u540e\u91cd\u8bd5"
						],
						1004: [config.jqMobileLoginPhone,
							"\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u624b\u673a\u53f7"
						],
						1100: [config.jqMobileSecureCode,
							"\u9a8c\u8bc1\u7801\u4e0d\u5339\u914d\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165"
						],
						1101: [config.jqMobileSecureCode,
							"\u4e3a\u4e86\u60a8\u7684\u8d26\u6237\u5b89\u5168\uff0c\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801"
						],
						1102: [config.jqMobileSecureCode,
							"\u9a8c\u8bc1\u7801\u5df2\u5931\u6548\uff0c\u8bf7\u91cd\u65b0\u83b7\u53d6"
						],
						1103: [config.jqMobileSecureCode,
							"\u670d\u52a1\u5668\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5"
						],
						1801: [config.jqMobileLoginPhone,
							"\u8be5\u624b\u673a\u83b7\u53d6\u9a8c\u8bc1\u7801\u5df2\u8fbe\u4e0a\u9650\uff0c\u8bf7\u9694\u65e5\u91cd\u8bd5"
						],
						1802: [config.jqMobileLoginPhone,
							"\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u540e\u91cd\u8bd5"
						],
						1900: [config.jqMobileLoginPhone,
							"\u624b\u673a\u53f7\u65e0\u6cd5\u767b\u5f55\uff0c\u8bf7\u5c1d\u8bd5\u5176\u4ed6\u767b\u5f55\u65b9\u5f0f"
						],
						1901: [config.jqMobileLoginPhone,
							"\u624b\u673a\u53f7\u65e0\u6cd5\u767b\u5f55\uff0c\u8bf7\u5c1d\u8bd5\u5176\u4ed6\u767b\u5f55\u65b9\u5f0f"
						],
						1601: [config.jqMobileLoginPhone,
							"\u624b\u673a\u53f7\u65e0\u6cd5\u767b\u5f55\uff0c\u8bf7\u5c1d\u8bd5\u5176\u4ed6\u767b\u5f55\u65b9\u5f0f"
						],
						1614: [config.jqMobileLoginPhone,
							"\u624b\u673a\u53f7\u65e0\u6cd5\u767b\u5f55\uff0c\u8bf7\u5c1d\u8bd5\u5176\u4ed6\u767b\u5f55\u65b9\u5f0f"
						],
						1808: [config.jqMobileLoginPhone,
							"\u8be5\u624b\u673a\u53f7\u6ce8\u518c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u66f4\u6362\u5176\u4ed6\u624b\u673a\u53f7\u518d\u8bd5"
						]
					};
					var errorCode = Number(rtn.code);
					if (errorCode === 1100 || (errorCode === 1101 || errorCode === 1102)) {
						if (config.mobileLoginSecureCode) config.mobileLoginSecureCode
							.configCaptchaTip(loginError[errorCode][1]);
						return false
					}
					if (!loginError[errorCode]) {
						var codeMsg =
							errorCode ? "(" + errorCode + ")" : "";
						Tool.ui.simpleDialog(
							"\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u540e\u91cd\u8bd5" +
							codeMsg);
						return false
					}
					loginError[errorCode][0].tip.status("warning", loginError[errorCode][1],
						loginError[errorCode][2]);
					return false
				},
				initCaptcha: function(config) {
					var vscConfig = config.vscConfig;
					var targetId = config.targetId;
					var mobile = config.mobile;
					Tool.module.data.captchaId = vscConfig.captchaId;
					if (!window.VipSecureCode) {
						this.simpleDialog("\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u518d\u8bd5");
						return false
					}
					var loadOpt = {
						url: vscConfig.templateId + "?captchaTrace=" + md5(vscConfig.captchaId),
						success: function() {
							createCaptcha()
						},
						error: function() {}
					};
					var createCaptcha = function() {
						var createOpt = {
							targetId: targetId,
							params: vscConfig,
							mobile: mobile,
							upMaxCountdown: 200,
							upTaskInterval: 5E3,
							smsMaxCountdown: 60,
							handleFailText: "\u91cd\u65b0\u9a8c\u8bc1",
							componentStyle: "inline",
							handleFailClick: function() {
								Tool.smsCaptchaFlow.preCheck()
							},
							onPassed: function(res) {
								var ticket = res.data && res.data.ticket || (res
									.ticket || "");
								Tool.module.data.captchaTicket = ticket;
								Tool.module.mobileLoginFormSubmit()
							},
							onFailed: function() {
								Tool.module.data.captchaTicket = ""
							},
							onBlur: function() {
								Tool.module.data.captchaTicket = ""
							}
						};
						var oldSmsInstance = Tool.module.data.instance;
						if (oldSmsInstance) {
							$("#J_verify_sms_placeholder").show();
							$("#J_verify_sms_load_fail").addClass("f-hide");
							oldSmsInstance.destroy()
						}
						var smsInstance = VipSecureCode.createInstance(createOpt);
						Tool.module.data.instance = smsInstance;
						$("#J_verify_sms_placeholder").hide();
						smsInstance.show()
					};
					VipSecureCode.load(loadOpt)
				},
				cleanCaptcha: function() {
					if (Tool.module.data.instance) {
						Tool.module.data.instance.destroy();
						$("#J_verify_sms_placeholder").show();
						$("#J_verify_sms_load_fail").addClass("f-hide");
						Tool.module.data.instance = null
					}
				},
				showSystemError: function(rtn) {
					if (typeof rtn === "string") {
						Tool.ui.simpleDialog(rtn);
						return false
					}
					var code = rtn && rtn.code;
					var codeMsg = code ? "(" + code + ")" : "";
					var data = rtn && rtn.data;
					if (rtn && (code === 1101 && (data && (data.captchaFlowData && data
							.captchaFlowData.templateId)))) {
						Tool.smsCaptchaFlow.handleCaptchaFlowData(rtn);
						return false
					}
					if (code === 1103) rtn.msg = rtn.msg ||
						"\u670d\u52a1\u5668\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5";
					var msg = rtn && rtn.msg ? rtn.msg + " " + codeMsg :
						"\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u540e\u91cd\u8bd5" +
						codeMsg;
					Tool.ui.simpleDialog(msg)
				}
			},
			event: {
				init: function() {
					var that = this;
					$(document).placeholder();
					that.submit();
					$.Listeners.sub("inputBindFinish").onsuccess(function() {
						that.loginNameInput();
						that.pwdInput();
						that.vpalAgree();
						that.mobileLoginAgree();
						that.phoneInput();
						that.smsInput();
						that.setPassword();
						that.getSwitch()
					})
				},
				getSwitch: function() {
					switchEncrypt.getSwitch("phoneEncrypt").done(function(data) {
						Tool.data.isEncrypt = data
					})
				},
				loginNameInput: function() {
					config.jqLoginName.on("blur", function() {
						Tool.module.valid.loginName(config.jqLoginName)
					})
				},
				pwdInput: function() {
					config.jqLoginPwd.on("keypress", function(e) {
						Tool.ui.capslock(capslock.detect(e))
					}).on("blur", function() {
						Tool.ui.capslock(false);
						Tool.module.valid.pwd(config.jqLoginPwd)
					})
				},
				phoneInput: function() {
					var supportSelectionApi =
						true;
					var phoneElement = config.jqMobileLoginPhone.get(0);
					if (phoneElement && (phoneElement.selectionStart === undefined || phoneElement
							.setSelectionRange === undefined)) {
						supportSelectionApi = false;
						config.jqMobileLoginPhone.attr("maxlength", "11")
					}
					config.jqMobileLoginPhone.on("focus", function() {
						config.jqMobileLoginPhone.tip.status()
					}).on("input", function() {
						if (!supportSelectionApi) Tool.module.resetSmsStatus(false);
						else {
							var originText = $(this).val();
							var text = originText;
							text = " " + text.replace(/\s/g, "");
							text = text.replace(/[ \w]{4}/g,
								function(matchSubString) {
									return matchSubString + " "
								});
							text = $.trim(text);
							Tool.module.resetSmsStatus(false);
							var start = this.selectionStart;
							if (start === 4 && originText[3] !== " " || start === 9 &&
								originText[8] !== " ") start = start + 1;
							if (start === 11 && originText.indexOf(" ") < 0) start = 13;
							$(this).val(text);
							this.setSelectionRange(start, start)
						}
						var isPhone = Tool.module.valid.phone(config.jqMobileLoginPhone);
						if (isPhone) Tool.smsCaptchaFlow.preCheck();
						else Tool.smsCaptchaFlow.cleanCaptcha()
					}).on("blur", function() {
						Tool.module.valid.phone(config.jqMobileLoginPhone)
					})
				},
				smsInput: function() {
					config.jqMobileLoginSms.on("focus", function() {
						config.jqMobileLoginSms.tip.status()
					}).on("change", function() {
						Tool.module.valid.sms(config.jqMobileLoginSms)
					}).on("blur", function() {
						Tool.module.valid.sms(config.jqMobileLoginSms)
					})
				},
				vpalAgree: function() {
					config.jqVpalAgree.on("click", function() {
						Tool.module.valid.protocolAgree(config.jqVpalAgree)
					})
				},
				mobileLoginAgree: function() {
					config.jqMobileLoginAgree.on("click", function() {
						Tool.module.valid.protocolAgree(config.jqMobileLoginAgree)
					})
				},
				setPassword: function() {
					config.jqSetPasswordInput.on("blur", function() {
						Tool.module.valid.setPasswordInput(config.jqSetPasswordInput)
					}).on("keyup", function() {
						Tool.module.checkStrength()
					});
					config.jqSetPasswordInputRepeat.on("blur", function() {
						Tool.module.valid.setPasswordRepeatInput(config
							.jqSetPasswordInputRepeat)
					});
					config.jqSetPasswordAgree.on("change", function() {
						Tool.module.valid.protocolAgree(config.jqSetPasswordAgree)
					});
					config.jqSetPasswordSubmit.on("click", function(event) {
						event.preventDefault();
						setTimeout(function() {
							Tool.module.setPasswordSubmit()
						}, 100);
						loginPageMars.send("PC_login_page_set_password_click", {
							loginPageType: config.loginPageType
						})
					})
				},
				submit: function() {
					config.jqLoginSubmit.on("click", function(event) {
						event.preventDefault();
						setTimeout(function() {
							Tool.module.formSubmit()
						}, 100);
						loginPageMars.loginClick(config.loginPageType, config
							.inputLoginType)
					});
					config.jqMobileLoginSubmit.on("click", function(event) {
						event.preventDefault();
						loginPageMars.loginClick(config.loginPageType, config
							.inputLoginType);
						if (Tool.module.data.captchaTicket) Tool.module
							.mobileLoginFormSubmit()
					});
					$(document).on("keydown", function(event) {
						if (event.keyCode == 13)
							if (config.inputLoginType === LoginType.LOGIN_TYPE_PASSWORD) {
								config.jqLoginName.blur();
								config.jqLoginSubmit.trigger("click")
							} else if (config.inputLoginType === LoginType
							.LOGIN_TYPE_MOBILE) {
							config.jqMobileLoginPhone.blur();
							config.jqMobileLoginSubmit.trigger("click")
						}
					})
				}
			},
			module: {
				UI: {
					container: null,
					tab: ".J-tab",
					tabNavItem: ".J-tab-nav-item",
					tabPanel: ".J-tab-panel",
					qrRow: ".J-qr-row",
					qrImgWrapper: ".J-qr-img-wrapper",
					qrImg: ".J-qr-img",
					qrGuideImg: ".J-qr-guide-img",
					buttonQrRetry: ".J-button-qr-retry",
					loginThird: ".J-login-third",
					buttonLoginMore: ".J-button-login-more",
					passwordLoginForget: ".J-password-login-forget",
					passwordLoginRegister: ".J-password-login-register",
					accountWrapper: ".J-account-wrapper",
					account: ".J-account",
					accountItem: ".J-account-item",
					captchaContainer: ".J-captcha-code-container",
					captcha: "#J-captcha-code",
					captchaContainerV2: ".J-captcha-code-container-v2",
					captchaV2: "#J-captcha-code-v2",
					mobileSecureCodeContainer: ".J-mobile-secure-code-container",
					mobileSecureCode: "#J-mobile-secure-code",
					captchaTip: ".J-captcha-tip",
					thirdLoginDisabled: ".J-third-item-disabled",
					passwordLoginForm: ".J-password-login-form",
					mobileLoginForm: ".J-mobile-login-form",
					switchToPasswordLogin: ".J-switch-to-password-login",
					switchToMobileLogin: ".J-switch-to-sms-login",
					thirdLoginOfflineNotice: ".J-login-third-offline-notice",
					loginPanel: ".J-login-panel",
					setPasswordPanel: ".J-set-password-panel",
					strengthIndicator: ".J-strength-indicator",
					tabSwitch: ".J-tab-switch",
					tabSwitchItem: ".J-tab-switch-item",
					tabTitle: ".J-tab-title"
				},
				status: {
					isTabNavItemActive: "is-tab-nav-item-active",
					isQrShowGuide: "is-qr-show-guide",
					isLoginThirdShowMore: "is-login-third-more",
					isQrScanDefault: "is-qr-scan-default",
					isAccountFrame: "is-account-frame",
					isAccountItemSelected: "is-account-item-selected",
					isAccountItemHighlight: "is-account-item-highlight",
					isAccountShowScroll: "is-account-show-scroll",
					isCaptchaTipStickLeftBottom: "is-captcha-tip-stick-left-bottom",
					hidden: "f-hide",
					btnLoading: "z-ui-btn-loading",
					tabSwitchQRCode: "c-tab-switch-button--qrcode",
					tabSwitchPassword: "c-tab-switch-button--password"
				},
				tmpl: {
					account: "J-tmpl-account",
					errorParamsDialog: "J_error_params_dialog_tpl"
				},
				event: {
					sub: {
						getQrImgSuccess: "get.login.qr.img.success",
						setQrStatusInvalid: "set.login.qr.status.invalid",
						setQrStatusConfirmed: "set.login.qr.status.confirmed"
					},
					pub: {
						getQrToken: "get.login.qr.token",
						getQrStatus: "get.login.qr.status",
						setQrStatusStop: "set.login.qr.status.stop",
						setQrStatusReset: "set.login.qr.status.reset",
						setQrStatusFailure: "set.login.qr.status.failure"
					}
				},
				data: {
					isShowQr: false,
					isShowQrFirst: false,
					isQrNeedAnimation: false,
					hasSetQrAnimation: false,
					qrAnimationConst: null,
					mobileLoginPid: "",
					isBSource: false,
					needShowPasswordPanel: false,
					passportType: "",
					setPwd: null,
					instance: null,
					captchaId: "",
					captchaTicket: ""
				},
				valid: {
					loginName: function(ele) {
						var _val = ele.val().replace(/\s/g, "");
						var isVaild = "";
						var msg = "";
						ele.val(_val);
						if (_val == "") {
							isVaild = "warning";
							msg = "\u8bf7\u8f93\u5165\u767b\u5f55\u540d"
						} else if (!/^[0-9a-zA-Z@\.\-_]+$/.test(_val)) {
							isVaild =
								"warning";
							msg = "\u767b\u5f55\u540d\u6709\u8bef"
						}
						ele.tip.status(isVaild, msg);
						return isVaild == ""
					},
					pwd: function(ele) {
						var _val = ele.val().replace(/\s/g, "");
						var isVaild = "";
						var msg = "";
						ele.val(_val);
						if (_val == "") {
							isVaild = "warning";
							msg = "\u8bf7\u8f93\u5165\u5bc6\u7801"
						}
						ele.tip.status(isVaild, msg);
						return isVaild == ""
					},
					phone: function(ele) {
						var _val = ele.val().replace(/\s/g, "");
						var status = "success";
						var msg = "";
						if (_val === "") {
							status = "warning";
							msg = "\u624b\u673a\u53f7\u4e0d\u80fd\u4e3a\u7a7a"
						} else if (!mobileValidation(_val)) {
							status =
								"warning";
							msg = "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u624b\u673a\u53f7"
						}
						ele.tip.status(status, msg);
						return status == "success"
					},
					sms: function(ele) {
						var _val = ele.val().replace(/\s/g, "");
						var status = "success";
						var msg = "";
						if (_val === "") {
							status = "warning";
							msg = "\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a"
						} else if (!/^[0-9]{6}$/.test(_val)) {
							status = "warning";
							msg =
								"\u9a8c\u8bc1\u7801\u4e0d\u5339\u914d\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165"
						}
						ele.tip.status(status, msg);
						return status === "success"
					},
					setPasswordInput: function(ele) {
						var msg =
							"";
						var status = "success";
						var value = ele.val();
						var validResult = PasswordRules.validate(value);
						if (!value) {
							status = "warning";
							msg = "\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a"
						} else if (!validResult.success) {
							msg = validResult.message;
							status = "warning"
						}
						ele.tip.status(status, msg);
						return status === "success"
					},
					setPasswordRepeatInput: function(ele) {
						var status = "success";
						var msg = "";
						var value = ele.val();
						if (!value) {
							status = "warning";
							msg = "\u8bf7\u8f93\u5165\u786e\u8ba4\u5bc6\u7801"
						} else if (value !== config.jqSetPasswordInput.val()) {
							status =
								"warning";
							msg =
								"\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4\uff0c\u8bf7\u91cd\u8bd5"
						}
						ele.tip.status(status, msg);
						return status === "success"
					},
					protocolAgree: function(ele) {
						var isVaild = "";
						var msg = "";
						var agreeCheck = ele.prop("checked");
						if (!agreeCheck) {
							isVaild = "warning";
							msg = "\u63a5\u53d7\u670d\u52a1\u534f\u8bae\u624d\u80fd\u767b\u5f55"
						}
						ele.tip.status(isVaild, msg);
						return isVaild == ""
					},
					submit: function() {
						var result = true;
						if (!this.loginName(config.jqLoginName)) result = false;
						if (!this.pwd(config.jqLoginPwd)) result =
							false;
						if (config.captchaId && !config.captchaTicket) result = false;
						if (config.whereFrom === "vipsfin" && !this.protocolAgree(config
								.jqVpalAgree)) result = false;
						return result
					},
					mobileLoginSubmit: function() {
						var result = true;
						if (!this.phone(config.jqMobileLoginPhone)) result = false;
						if (config.whereFrom === "vipsfin" && !this.protocolAgree(config
								.jqMobileLoginAgree)) result = false;
						return result
					},
					setPasswordSubmit: function() {
						var result = true;
						if (!this.setPasswordInput(config.jqSetPasswordInput) || !this
							.setPasswordRepeatInput(config.jqSetPasswordInputRepeat)) result =
							false;
						if (Number(Tool.module.data.passportType) === 2 && !this.protocolAgree(
								config.jqSetPasswordAgree)) result = false;
						return result
					}
				},
				countdown: null,
				init: function(initData) {
					this.UI.container = initData.container;
					this.data.isShowQr = initData.isShowQr;
					this.data.isShowQrFirst = initData.isShowQrFirst;
					this.data.isBSource = initData.isBSource;
					this.countdown = new Countdown;
					this.bindEvent();
					this.bindEventListener();
					if (this.data.isShowQr) this.activeTab();
					AD.init();
					this.autocompleteLoginName();
					this.inputBindTip(config.aFormInput);
					if (this.data.isShowQr && !!$.Var.get("isShowQrFirst")) loginPageMars.tabShow(
						loginPageMars.config.tabName.TAB_NAME_QR_CODE_LOGIN);
					else loginPageMars.tabShow(loginPageMars.config.tabName
					.TAB_NAME_PASSWORD_LOGIN);
					this.resizeIframe()
				},
				bindEvent: function() {
					var that = this;
					$(this.UI.container).on("click", this.UI.buttonQrRetry, function() {
						$.Listeners.pub(that.event.pub.getQrToken).success();
						loginPageMars.qrCodeRefreshClick()
					}).on("click", this.UI.buttonLoginMore, function() {
						that.toggleLoginMore()
					}).on("mouseenter",
						this.UI.qrRow,
						function() {
							that.setQrAnimationIn()
						}).on("mouseleave", this.UI.qrRow, function() {
						that.setQrAnimationOut()
					}).on("click", this.UI.passwordLoginForget, function() {
						loginPageMars.forgetPasswordClick(config.loginPageType)
					}).on("click", this.UI.passwordLoginRegister, function() {
						loginPageMars.registerClick(config.loginPageType)
					}).on("click", this.UI.accountItem, function() {
						$(that.UI.account).find(that.UI.accountItem).removeClass(that.status
							.isAccountItemSelected);
						$(that.UI.account).find("input[name=username]").prop("checked",
							false);
						$(this).find("input[name=username]").prop("checked", true);
						$(this).addClass(that.status.isAccountItemSelected)
					}).on("mouseenter", this.UI.accountItem, function() {
						$(this).addClass(that.status.isAccountItemHighlight)
					}).on("mouseleave", this.UI.accountItem, function() {
						$(this).removeClass(that.status.isAccountItemHighlight)
					}).on("click", this.UI.thirdLoginDisabled, function() {
						var tip = $(this).attr("title");
						Tool.ui.simpleDialog(tip ||
							"\u8be5\u767b\u5f55\u65b9\u5f0f\u6b63\u5728\u5347\u7ea7\uff0c\u6682\u4e0d\u53ef\u7528\uff0c\u8bf7\u9009\u62e9\u5176\u4ed6\u767b\u5f55\u65b9\u5f0f"
							)
					}).on("click",
						this.UI.switchToPasswordLogin,
						function() {
							var $container = $(that.UI.container);
							$container.find(that.UI.passwordLoginForm).removeClass(that.status
								.hidden);
							$container.find(that.UI.mobileLoginForm).addClass(that.status
								.hidden);
							Tool.module.resizeIframe();
							config.inputLoginType = LoginType.LOGIN_TYPE_PASSWORD;
							loginPageMars.switchClick(config.inputLoginType)
						}).on("click", this.UI.switchToMobileLogin, function() {
						var $container = $(that.UI.container);
						$container.find(that.UI.passwordLoginForm).addClass(that.status
							.hidden);
						$container.find(that.UI.mobileLoginForm).removeClass(that.status
							.hidden);
						Tool.module.resizeIframe();
						config.inputLoginType = LoginType.LOGIN_TYPE_MOBILE;
						loginPageMars.switchClick(config.inputLoginType)
					}).on("click", this.UI.tabSwitchItem, function() {
						var $this = $(this);
						var tabName = "";
						var tabTitle = "";
						if ($this.hasClass(that.status.tabSwitchQRCode)) {
							tabName = "qr";
							tabTitle = "\u626b\u7801\u767b\u5f55"
						} else {
							tabName = "form";
							tabTitle = "\u8d26\u6237\u767b\u5f55"
						}
						$(that.UI.container).find(that.UI.tabTitle).html(tabTitle);
						$this.toggleClass(that.status.tabSwitchQRCode);
						$this.toggleClass(that.status.tabSwitchPassword);
						that.didSwitchTab(tabName)
					});
					$(document).on("click", ".J-login-frame-close", function() {
						var isNotLoginPanel = $(Tool.module.UI.container).find(Tool.module
							.UI.loginPanel).hasClass(Tool.module.status.hidden);
						if (isNotLoginPanel) Tool.module.switchPanel("login");
						else $.messenger && $.messenger.send("method=closeDialog")
					})
				},
				bindEventListener: function() {
					var that = this;
					$.Listeners.sub(this.event.sub.getQrImgSuccess).onsuccess(function(result) {
						that.renderQrImg(result.qrImgUrl);
						if (that.data.isShowQr && that.data.isShowQrFirst) {
							that.setQrAnimationIn();
							that.data.hasSetQrAnimation = true;
							setTimeout(function() {
								that.setQrAnimationOut()
							}, 5E3)
						}
					});
					$.Listeners.sub(this.event.sub.setQrStatusInvalid).onsuccess(function() {
						that.data.isQrNeedAnimation = false
					});
					$.Listeners.sub(this.event.sub.setQrStatusConfirmed).onsuccess(function() {
						loginPageMars.loginSuccess(loginPageMars.config.loginType
							.LOGIN_TYPE_QR_CODE, config.loginPageType)
					})
				},
				redirect: function() {
					parent.location.href = config.redirectUrl
				},
				loginSuc: function() {
					loginPageMars.loginSuccess(config.inputLoginType, config.loginPageType);
					if (config.isIFrame && $.messenger) $.messenger.send("method=loginSuccess");
					else this.redirect()
				},
				autocompleteLoginName: function() {
					var remLoginName = config.userName;
					if (remLoginName) {
						if (!("placeholder" in document.createElement("input"))) config.jqLoginName
							.trigger("keypress");
						config.jqLoginName.focus().val(remLoginName)
					}
				},
				inputBindTip: function(arr) {
					var that = this;

					function Tip(ele) {
						this.$input = ele;
						this.$itemGroup = ele.parents(".J_item_group");
						this.$tip = this.$itemGroup.find(".J_form_tip .text")
					}
					Tip.prototype.status = function(status, msg, errorMark) {
						this.$itemGroup.removeClass(
							"z-u-form-item-warning z-u-form-item-success");
						msg = status == "warning" ? msg || "" : "";
						if (!errorMark)(status == "success" || status == "warning") && this
							.$itemGroup.addClass("z-u-form-item-" + status);
						this.$tip.html(msg);
						if (this.$itemGroup.hasClass("J_hidden")) {
							if (msg) this.$itemGroup.removeClass(config.status.hidden);
							else this.$itemGroup.addClass(config.status.hidden);
							if (config.isIFrame &&
								window.resizeIframe) that.resizeIframe()
						}
					};
					$(arr).each(function(num, ele) {
						ele.tip = new Tip(ele)
					});
					$.Listeners.pub("inputBindFinish").success()
				},
				formSubmit: function() {
					if (config.captchaInstance) {
						var validateResult = config.captchaInstance.validate();
						if (validateResult && Number(validateResult.status) === 120) {
							config.hasInterruptLoginByCaptcha = true;
							return
						}
					}
					var submitBtn = config.jqLoginSubmit;
					if (submitBtn.hasClass("z-ui-btn-loading")) return false;
					if (!this.valid.submit()) return false;
					config.jqFormError.tip.status();
					mars.send();
					submitBtn.addClass("z-ui-btn-loading");
					var url = Tool.data.rootPath + "/login";
					if (Tool.data.isEncrypt) url = Tool.data.rootPath + "/login/postLogin";
					ajaxHelper.req({
						url: url,
						type: "post",
						dataType: "json",
						isEncrypt: Tool.data.isEncrypt,
						Authorization: Tool.data.isEncrypt ? "pc" : "",
						data: {
							loginName: config.jqLoginName.val(),
							password: md5(config.jqLoginPwd.val()),
							remUser: config.jqRememberName.prop("checked") ? 1 : 0,
							whereFrom: config.whereFrom,
							captchaId: config.passwordLoginSecureCode ? config
								.passwordLoginSecureCode.captchaId : "",
							captchaTicket: config.passwordLoginSecureCode ? config
								.passwordLoginSecureCode.captchaTicket : ""
						}
					}).done(function(data) {
						if (data.result == "haslogin") Tool.module.loginSuc();
						else if (data.result == "error") {
							Tool.module.submitError(data.errorCode, data);
							submitBtn.removeClass("z-ui-btn-loading")
						} else if (data.result == "success" && data.data) {
							config.redirectUrl = data.data.redirectUrl || config
							.redirectUrl;
							var isBindMobile = data.data.bindMobile;
							Tool.module.afterLogin(data.data.signedApiUrl, !!data.data
								.illegalState, isBindMobile)
						} else {
							Tool.module.submitError(6,
								data);
							submitBtn.removeClass("z-ui-btn-loading")
						}
					})
				},
				submitError: function(status, rtn) {
					var redirectUrl;
					var extend;
					var unFreezeTime;
					var unFreezeUrl;
					var errorStatus = status;
					var that = this;
					if (rtn.data) {
						redirectUrl = rtn.data.redirectUrl;
						extend = rtn.data.extend || {};
						unFreezeTime = extend.unFreezeTime || "";
						unFreezeUrl = extend.unFreezeUrl || ""
					}
					if (isNaN(status)) return false;
					var loginError = {
						1600: [config.jqFormError,
							"\u767b\u5f55\u8d26\u53f7\u6216\u5bc6\u7801\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165",
							true
						],
						500: [config.jqLoginName,
							"\u60a8\u7684\u8d26\u6237\u53ef\u80fd\u5b58\u5728\u5f02\u5e38\uff0c\u672c\u6b21\u767b\u5f55\u5931\u8d25\u3002\u5982\u6709\u9700\u8981\uff0c\u8bf7\u8054\u7cfb\u5ba2\u670d\uff1a400-6789-888"
						],
						1604: [config.jqLoginName,
							"\u767b\u5f55\u5931\u8d25\uff0c\u8bf7\u660e\u65e5\u518d\u8bd5\u6216\u8054\u7cfb\u5ba2\u670d"
						],
						1610: [config.jqFormError,
							"\u8d26\u53f7\u56e0\u6709\u5b89\u5168\u98ce\u9669\u5df2\u88ab\u51bb\u7ed3\uff0c\u8bf7\u8054\u7cfb\u5ba2\u670d"
						],
						1611: [config.jqFormError,
							"\u8d26\u53f7\u56e0\u6709\u5b89\u5168\u98ce\u9669\u5df2\u88ab\u51bb\u7ed3\uff0c" +
							(unFreezeTime ? "\u8bf7\u4e8e" + unFreezeTime + "\u540e" :
								"\u8bf7\u7a0d\u540e") +
							"\u91cd\u65b0\u5c1d\u8bd5\u767b\u5f55\u6216\u8054\u7cfb\u5ba2\u670d"
						],
						1612: [config.jqFormError,
							"\u8d26\u53f7\u5df2\u88ab\u51bb\u7ed3\uff0c" + (unFreezeTime ?
								"\u8bf7\u4e8e" + unFreezeTime + "\u540e" :
								"\u8bf7\u7a0d\u540e") +
							"\u91cd\u65b0\u5c1d\u8bd5\u767b\u5f55" + (unFreezeUrl ?
								'\u6216 <a href="' + unFreezeUrl +
								'" title="\u89e3\u9664\u51bb\u7ed3" target="_parent" class="u-link">\u70b9\u6b64\u89e3\u9664\u51bb\u7ed3</a>' :
								"")
						],
						1613: [config.jqFormError,
							"\u8d26\u53f7\u56e0\u6709\u88ab\u76d7\u98ce\u9669\u5df2\u88ab\u51bb\u7ed3" +
							(unFreezeUrl ? '\uff0c\u8bf7 <a href="' + unFreezeUrl +
								'" title="\u89e3\u9664\u51bb\u7ed3" target="_parent" class="u-link">\u70b9\u6b64\u89e3\u9664\u51bb\u7ed3</a>' :
								"")
						],
						1614: [config.jqLoginName,
							"\u60a8\u767b\u5f55\u7684\u8d26\u53f7\u5df2\u7ecf\u6ce8\u9500"
						],
						1100: [config.jqLoginCaptcha, "\u9a8c\u8bc1\u7801\u6709\u8bef"],
						1101: [config.jqLoginCaptcha,
							"\u4e3a\u4e86\u60a8\u7684\u8d26\u6237\u5b89\u5168\uff0c\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801"
						],
						1102: [config.jqLoginCaptcha, "\u9a8c\u8bc1\u7801\u8fc7\u671f"],
						1103: [config.jqFormError,
							"\u670d\u52a1\u5668\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5"
						],
						3001: [config.jqFormError,
							"\u8d26\u53f7\u5bc6\u7801\u547d\u4e2d\u591a\u4e2a\u8d26\u53f7\uff0c\u5efa\u8bae\u524d\u5f80www.vip.com\u767b\u5f55\u4fee\u6539\u5bc6\u7801"
						]
					};
					var captchaData = (rtn.data || {}).captchaFlowData;
					if (captchaData && (captchaData.captchaId && (captchaData.templateId &&
							captchaData.captchaType))) {
						if (config.passwordLoginSecureCode) config.passwordLoginSecureCode
							.cleanCaptcha();
						config.passwordLoginSecureCode = new SecureCode({
							captchaId: captchaData.captchaId,
							templateId: captchaData.templateId + "?v=" + Date.now(),
							captchaType: captchaData.captchaType,
							extend: {},
							targetId: Tool.module.UI.captcha.substring(1),
							container: Tool.module.UI.captchaContainer,
							onShow: function() {
								Tool.module.resizeIframe()
							},
							onPassed: function() {
								if (config.hasInterruptLoginByCaptcha) {
									config.hasInterruptLoginByCaptcha = false;
									Tool.module.formSubmit()
								}
							}
						})
					} else {
						config.passwordLoginSecureCode && config.passwordLoginSecureCode
							.cleanCaptcha();
						config.passwordLoginSecureCode = null;
						Tool.module.resizeIframe()
					}
					if (Number(errorStatus) === 1100 || (Number(errorStatus) === 1101 || Number(
							errorStatus) === 1102)) {
						if (config.passwordLoginSecureCode) config.passwordLoginSecureCode
							.configCaptchaTip(loginError[errorStatus][1]);
						return false
					}
					if (Number(errorStatus) === 1612 && !unFreezeUrl) errorStatus = 1611;
					if (Number(errorStatus) === 1613 && !unFreezeUrl) errorStatus = 1610;
					if (Number(errorStatus) === 500 || Number(errorStatus) === 1103) {
						Tool.ui.simpleDialog(loginError[errorStatus][1]);
						return false
					}
					if (Number(errorStatus) === 1602) {
						var $accountFirstItem;
						var checkAccountScroll = function() {
							var accountItemCount = $(that.UI.account).find(that.UI.accountItem)
								.length;
							if (config.isIFrame && accountItemCount > 3 || !config.isIFrame &&
								accountItemCount > 5) $(that.UI.account).addClass(that.status
								.isAccountShowScroll)
						};
						if (config.isIFrame) {
							$("#J_login_form").hide();
							$(this.UI.accountWrapper).html($.Tpl(this.tmpl.account, rtn.data))
							.show();
							$(this.UI.account).addClass(this.status.isAccountFrame);
							checkAccountScroll();
							config.jqFormError = $("#J_username_error");
							config.jqLoginName = config.jqFormError;
							this.inputBindTip([config.jqFormError]);
							this.resizeIframe()
						} else {
							window.usernameDialog = $.Dialog({
								model: true,
								opacity: 0.5,
								title: "\u8bf7\u9009\u62e9\u60a8\u8981\u767b\u5f55\u7684\u8d26\u53f7",
								size: "medium",
								content: $.Tpl(this.tmpl.account, rtn.data),
								closeBtnAttr: {
									"mars_sead": "383|2|4|17"
								},
								showEvent: function() {
									checkAccountScroll()
								},
								closeEvent: function() {
									this.remove()
								}
							});
							usernameDialog.open()
						}
						$accountFirstItem = $(this.UI.account).find(this.UI.accountItem).first();
						$accountFirstItem.addClass(this.status.isAccountItemSelected);
						$accountFirstItem.find("input[name=username]").prop("checked", true);
						$(".J-username-submit").on("click", function() {
							var _data = {
								selectId: $("input[name=username]:checked").val(),
								loginName: $("input[name=username]:checked").data(
									"username"),
								whereFrom: config.whereFrom
							};
							Tool.module.selectAccountLogin(_data)
						});
						return false
					}
					if (Number(errorStatus) === 1603 && redirectUrl) {
						Tool.module.showChallenge(redirectUrl);
						return false
					}
					if (Number(errorStatus) === 3E3) {
						Tool.module.showErrorTipDialog();
						return
					}
					if (!loginError[errorStatus]) {
						Tool.ui.simpleDialog(
							"\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5"
							);
						return false
					}
					loginError[errorStatus][0].tip.status("warning", loginError[errorStatus][1],
						loginError[errorStatus][2]);
					return false
				},
				showChallenge: function(redirectUrl) {
					var tpl = $.Tpl("J_loginChallenge_tpl");
					var dialog = $.Dialog({
						node: "#J_dialog",
						custom: true,
						customStyle: true,
						size: [400, 246],
						content: tpl
					});
					dialog.open();
					$(".u-loginChallenge-btn").on("click", function() {
						parent.location.href =
							redirectUrl
					});
					var times = 3;
					var callSelf = function() {
						$(".u-left-time").html(times);
						if (times !== 0) {
							times--;
							setTimeout(callSelf, 1E3)
						} else parent.location.href = redirectUrl
					};
					callSelf()
				},
				selectAccountLogin: function(data) {
					var submitBtn = config.jqLoginSubmit;
					$.ajax({
						url: Tool.data.rootPath + "/login/selectAccountLogin",
						type: "post",
						data: data,
						dataType: "json",
						success: function(data) {
							window.usernameDialog && usernameDialog.close();
							if (data.result == "haslogin") Tool.module.loginSuc();
							else if (data.result == "error") {
								Tool.module.submitError(data.errorCode,
									data);
								submitBtn.removeClass("z-ui-btn-loading")
							} else if (data.result == "success" && data.data) {
								config.redirectUrl = data.data.redirectUrl || config
									.redirectUrl;
								var isBindMobile = data.data.bindMobile;
								Tool.module.afterLogin(data.data.signedApiUrl, !!data
									.data.illegalState, isBindMobile)
							} else {
								Tool.module.submitError(6, data);
								submitBtn.removeClass("z-ui-btn-loading")
							}
						},
						error: function() {
							Tool.module.loginSuc();
							return
						}
					})
				},
				afterLogin: function(url, isRisk, isBindMobile) {
					var process = function() {
						if (isRisk) {
							AccountRisk.init(function() {
									Tool.module.loginSuc()
								},
								config.jqLoginPwd.val());
							return
						}
						if (!isBindMobile) {
							Tool.module.needBindPhone();
							return
						}
						Tool.module.loginSuc()
					};
					if (url) $.ajax({
						url: url,
						type: "get",
						dataType: "jsonp",
						success: function(result) {
							if (result.status == 1) process();
							else Tool.ui.simpleDialog(
								"\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5"
								)
						},
						error: function() {
							Tool.module.loginSuc();
							return
						}
					});
					else process()
				},
				needBindPhone: function() {
					if (window.PhoneBind) var phoneComponent = new PhoneBind({
						phoneNum: "",
						isBg: true,
						haveTip: true,
						show: false,
						success: function() {
							Tool.module.loginSuc()
						},
						cancel: function() {
							Tool.module.loginSuc()
						}
					});
					try {
						phoneComponent.show()
					} catch (e) {
						Tool.module.loginSuc()
					}
				},
				getInputPhone: function() {
					return config.jqMobileLoginPhone.val().replace(/\s/g, "")
				},
				mobileLoginFormSubmit: function() {
					if (config.jqMobileLoginSubmit.hasClass(this.status.btnLoading)) return false;
					if (!this.valid.mobileLoginSubmit()) return false;
					if (Tool.module.data.instance && !Tool.module.data.captchaTicket) {
						Tool.module.data.instance.validate();
						return false
					}
					config.jqMobileLoginSubmit.addClass(this.status.btnLoading);
					var reqData = {
						pid: this.data.mobileLoginPid,
						passportType: this.data.passportType,
						setPwd: this.data.setPwd === undefined ? "" : this.data.setPwd,
						whereFrom: config.whereFrom,
						smsTicket: this.data.captchaTicket
					};
					ajaxHelper.req({
						url: Tool.data.rootPath + "/mobileLogin/v2/checkSmsTicket",
						type: "post",
						dataType: "json",
						data: reqData,
						Authorization: "pc"
					}).done(function(rtn) {
						if (Number(rtn.code) === 200) {
							var data = rtn.data || {};
							if (data.redirectUrl) config.redirectUrl = rtn.data.redirectUrl;
							if (data.pid) Tool.module.data.mobileLoginPid =
								data.pid;
							if (Tool.module.data.needShowPasswordPanel) {
								config.jqMobileLoginSubmit.removeClass(Tool.module.status
									.btnLoading);
								Tool.module.switchPanel("setPassword")
							} else Tool.module.mobileLogin()
						} else {
							if (Number(rtn.code) == 1603 && (rtn && (rtn.data && rtn.data
									.redirectUrl))) {
								Tool.module.showChallenge(rtn.data.redirectUrl);
								return false
							}
							Tool.smsCaptchaFlow.showSystemError(rtn);
							config.jqMobileLoginSubmit.removeClass(Tool.module.status
								.btnLoading)
						}
					}).fail(function() {
						config.jqMobileLoginSubmit.removeClass(Tool.module.status
							.btnLoading);
						Tool.smsCaptchaFlow.showSystemError(
							"\u670d\u52a1\u5f02\u5e38\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5"
							)
					})
				},
				switchPanel: function(targetPanel) {
					if (targetPanel === "setPassword") {
						$(Tool.module.UI.loginPanel).addClass(Tool.module.status.hidden);
						$(Tool.module.UI.setPasswordPanel).removeClass(Tool.module.status.hidden);
						config.jqSetPasswordInput.attr("type", "password");
						config.jqSetPasswordInputRepeat.attr("type", "password");
						if (Number(Tool.module.data.passportType) === 1) config.jqSetPasswordAgree
							.parents(".J_item_group").addClass(Tool.module.status.hidden);
						loginPageMars.send("PC_login_page_set_password_expose", {
							loginPageType: config.loginPageType
						})
					} else {
						$(Tool.module.UI.setPasswordPanel).addClass(Tool.module.status.hidden);
						$(Tool.module.UI.loginPanel).removeClass(Tool.module.status.hidden)
					}
					Tool.module.resizeIframe()
				},
				mobileLogin: function() {
					ajaxHelper.req({
						url: Tool.data.rootPath + "/mobileLogin/v2/login",
						type: "post",
						dataType: "json",
						isEncrypt: Tool.data.isEncrypt,
						data: {
							pid: Tool.module.data.mobileLoginPid,
							whereFrom: config.whereFrom,
							setPwd: true
						},
						Authorization: "pc"
					}).done(function(rtn) {
						config.jqMobileLoginSubmit.removeClass(Tool.module.status
							.btnLoading);
						if (Number(rtn.code) === 200) {
							var data = rtn.data || {};
							if (data.redirectUrl) config.redirectUrl = rtn.data.redirectUrl;
							Tool.module.loginSuc()
						} else Tool.smsCaptchaFlow.showSystemError(rtn)
					}).fail(function() {
						config.jqMobileLoginSubmit.removeClass(Tool.module.status
							.btnLoading);
						Tool.smsCaptchaFlow.showSystemError(
							"\u670d\u52a1\u5f02\u5e38\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5"
							)
					})
				},
				mobileLoginError: function(rtn) {
					var code = rtn && rtn.code;
					var codeMsg = code ? "(" + code + ")" : "";
					Tool.ui.simpleDialog(
						"\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u540e\u91cd\u8bd5" +
						codeMsg)
				},
				setPasswordSubmit: function() {
					if (config.jqSetPasswordSubmit.hasClass(Tool.module.status.btnLoading))
					return false;
					if (!Tool.module.valid.setPasswordSubmit()) return false;
					config.jqSetPasswordSubmit.addClass(Tool.module.status.btnLoading);
					var isRegister = Number(Tool.module.data.passportType) === 2;
					var url = Tool.data.rootPath + (isRegister ? "/mobileLogin/v2/register" :
						"/mobileLogin/v2/login");
					var data = {
						pid: Tool.module.data.mobileLoginPid,
						password: window.md5(config.jqSetPasswordInput.val()),
						whereFrom: config.whereFrom
					};
					if (isRegister) data.agree = config.jqSetPasswordAgree.prop("checked") ? "1" :
						"0";
					else data.setPwd = false;
					ajaxHelper.req({
						url: url,
						type: "post",
						dataType: "json",
						data: data,
						Authorization: "pc"
					}).done(function(rtn) {
						config.jqSetPasswordSubmit.removeClass(Tool.module.status
							.btnLoading);
						var data = rtn.data || {};
						if (Number(rtn.code) === 200) {
							if (data && data.redirectUrl) config.redirectUrl = data
								.redirectUrl;
							config.inputLoginType = LoginType.LOGIN_TYPE_REGISTER;
							Tool.module.loginSuc()
						} else Tool.smsCaptchaFlow.showSystemError(rtn)
					}).fail(function() {
						config.jqSetPasswordSubmit.removeClass(Tool.module.status
							.btnLoading);
						Tool.smsCaptchaFlow.showSystemError(
							"\u670d\u52a1\u5f02\u5e38\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5"
							)
					})
				},
				setPasswordSubmitError: function(rtn) {
					var code = rtn && rtn.code;
					var codeMsg = code ? "(" + code + ")" : "";
					Tool.ui.simpleDialog(
						"\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u540e\u91cd\u8bd5" +
						codeMsg)
				},
				checkStrength: function() {
					var $indicator = $(this.UI.container).find(this.UI.strengthIndicator);
					var result = PasswordRules.validate(config.jqSetPasswordInput.val());
					var msg = result.message;
					if (result.success)
						if (result.strength ==
							"m") msg = "\u5bc6\u7801\u5b89\u5168\u5f3a\u5ea6\u9002\u4e2d";
						else if (result.strength == "s") msg =
						"\u4f60\u7684\u5bc6\u7801\u5f88\u5b89\u5168";
					$indicator.show();
					$indicator.removeClass("login-pwd-w login-pwd-m login-pwd-s");
					$indicator.addClass("login-pwd-" + result.strength);
					config.jqSetPasswordInput.tip.status(result.success ? "success" : "warning",
						msg)
				},
				getParamForUrl: function() {
					var urlData = {},
						search = window.location.search;
					if (search.length > 1) {
						search = search.substr(1);
						var itemStr = search.split("&");
						for (var i = 0; i <
							itemStr.length; i++) {
							var item = itemStr[i].split("=");
							urlData[item[0]] = decodeURIComponent(item[1])
						}
					}
					return urlData
				},
				renderQrImg: function(qrImgUrl) {
					if (qrImgUrl === "") $.Listeners.pub(this.event.pub.setQrStatusFailure)
					.success();
					else {
						$.Listeners.pub(this.event.pub.setQrStatusReset).success();
						$(this.UI.container).find(this.UI.qrImg).attr("src", qrImgUrl);
						this.data.isQrNeedAnimation = true;
						loginPageMars.qrCodeShow()
					}
				},
				activeTab: function() {
					var that = this;
					var $container = $(this.UI.tab);
					var tabNavItem = $container.find(this.UI.tabNavItem);
					var currentItemTag;
					tabNavItem.each(function() {
						var $this = $(this);
						$this.on("click", function() {
							$this.addClass(that.status.isTabNavItemActive).siblings(
								tabNavItem).removeClass(that.status
								.isTabNavItemActive);
							currentItemTag = $(this).data("current-item");
							that.didSwitchTab(currentItemTag)
						})
					})
				},
				didSwitchTab: function(tab) {
					var that = this;
					var index = tab === "qr" ? 0 : 1;
					var tabPanel = $(this.UI.tab).find(this.UI.tabPanel);
					tabPanel.eq(index).removeClass("f-hide").siblings().addClass("f-hide");
					if (tab === "qr") {
						$.Listeners.pub(this.event.pub.getQrStatus).success();
						if (!this.data.hasSetQrAnimation) {
							this.setQrAnimationIn();
							this.data.hasSetQrAnimation = true;
							setTimeout(function() {
								that.setQrAnimationOut()
							}, 5E3)
						}
						loginPageMars.tabShow(loginPageMars.config.tabName.TAB_NAME_QR_CODE_LOGIN)
					} else {
						$.Listeners.pub(this.event.pub.setQrStatusStop).success();
						loginPageMars.tabShow(loginPageMars.config.tabName.TAB_NAME_PASSWORD_LOGIN)
					}
					this.resizeIframe()
				},
				toggleLoginMore: function() {
					var $loginThird = $(this.UI.container).find(this.UI.loginThird);
					if ($loginThird.hasClass(this.status.isLoginThirdShowMore)) $(this.UI.container)
						.find(this.UI.loginThird).removeClass(this.status.isLoginThirdShowMore);
					else {
						$(this.UI.container).find(this.UI.loginThird).addClass(this.status
							.isLoginThirdShowMore);
						if ($loginThird.find(this.UI.thirdLoginOfflineNotice).length > 0)
							loginPageMars.send("PC_login_page_offline_notice_expose", {
								loginPageType: config.loginPageType
							})
					}
					this.resizeIframe()
				},
				resizeIframe: function() {
					if (config.isIFrame && window.resizeIframe) window.resizeIframe()
				},
				setQrAnimationIn: function() {
					var that = this;
					if (!this.data.isQrNeedAnimation) return;
					var left = Tool.module.data.isBSource && !config.isIFrame ? 90 : 30;
					this.data.qrAnimationConst =
						setTimeout(function() {
							$(that.UI.container).find(that.UI.qrImgWrapper).animate({
								left: left
							}, 300, function() {
								$(that.UI.container).find(that.UI.qrGuideImg).css({
									display: "block"
								}).animate({
									opacity: 1
								}, 300)
							})
						}, 500)
				},
				setQrAnimationOut: function() {
					var that = this;
					if (!this.data.isQrNeedAnimation) return;
					clearTimeout(this.data.qrAnimationConst);
					var left = Tool.module.data.isBSource && !config.isIFrame ? 155 : 94;
					$(this.UI.container).find(this.UI.qrGuideImg).animate({
						opacity: 0
					}, 300, function() {
						$(that.UI.container).find(that.UI.qrGuideImg).css({
							display: "none"
						});
						$(that.UI.container).find(that.UI.qrImgWrapper).animate({
							left: left
						}, 300)
					})
				},
				showCancelledAccountDialogIfNeed: function() {
					var params = window.Tool.module.getParamForUrl() || {};
					if (params.isAccountCancelled === "true" && !$.Storage.get(params.dialogId)) {
						Tool.ui.simpleDialog(
							"\u8be5\u8d26\u6237\u5df2\u88ab\u51bb\u7ed3\u6216\u6ce8\u9500\uff0c\u8bf7\u66f4\u6362\u8d26\u6237\u540e\u518d\u767b\u5f55\u3002"
							);
						$.Storage.set(params.dialogId, true, 3600 * 24)
					}
				},
				showSetPasswordAfterChallengeIfNeed: function() {
					var params = window.Tool.module.getParamForUrl() || {};
					if (params.isSetPasswordAfterChallenge === "true") {
						Tool.module.data.mobileLoginPid = params.pid || "";
						Tool.module.data.passportType = params.passportType || "";
						Tool.module.data.setPwd = params.setPwd !== "false";
						config.jqMobileLoginPhone.val(params.mobile || "");
						Tool.module.switchPanel("setPassword")
					}
				},
				showErrorTipsDialogIfNeed: function() {
					if (Number($.Var.get("errorCode") === 3E3)) this.showErrorTipDialog()
				},
				showErrorTipDialog: function() {
					var closeAction = function() {
						if (config.isIFrame && $.messenger) $.messenger.send(
							"method=closeDialog");
						else window.history.go(-1)
					};
					var dialog = $.Dialog({
						model: true,
						opacity: 0.5,
						title: "\u63d0\u793a",
						size: "small",
						content: $.Tpl(this.tmpl.errorParamsDialog),
						closeEvent: function() {
							this.remove();
							closeAction()
						},
						button: [{
							type: "default",
							text: "\u5173\u95ed",
							size: "medium",
							event: function() {
								this.remove();
								closeAction()
							}
						}]
					});
					dialog.open()
				},
				resetSmsStatus: function(forceDisableButton) {
					Tool.module.data.mobileLoginPid = ""
				}
			},
			init: function() {
				this.ui.init();
				this.event.init();
				this.module.init({
					container: ".J-container",
					isShowQr: !!$.Var.get("isShowQr"),
					isShowQrFirst: !!$.Var.get("isShowQrFirst"),
					isBSource: !!$.Var.get("isBSource")
				});
				loginPageMars.loginPageShow()
			}
		};
		window.config = {
			init: function() {
				this.isIFrame = self != top;
				if (this.isIFrame) this.loginPageType = loginPageMars.config.loginPageType
					.LOGIN_PAGE_TYPE_POP;
				else this.loginPageType = loginPageMars.config.loginPageType.LOGIN_PAGE_TYPE_NORMAL;
				var params = window.Tool.module.getParamForUrl() || {};
				this.whereFrom = params.whereFrom || "";
				loginPageMars.configCommonParams({
					loginPageType: this.loginPageType,
					whereFrom: this.whereFrom
				});
				var isPasswordLoginHidden = $(Tool.module.container).find(Tool.module.UI
					.passwordLoginForm).hasClass(Tool.module.status.hidden);
				this.inputLoginType = isPasswordLoginHidden ? LoginType.LOGIN_TYPE_MOBILE :
					LoginType.LOGIN_TYPE_PASSWORD;
				this.status = {
					hidden: "f-hidden",
					isShowTooltips: "z-ui-tooltips-in"
				};
				this.jqLoginName = $("#J_login_name");
				this.jqLoginPwd = $("#J_login_pwd");
				this.jqLoginCaptcha = $("#J-captcha-code");
				this.jqVpalAgree = $("#J_vpal_agree");
				this.jqLoginSubmit = $("#J_login_submit");
				this.jqCapslockTip = $("#J_capslock_tip");
				this.jqRememberName = $("#J_remember_username");
				this.jqFormError = $("#J_form_error");
				this.jqMobileLoginPhone = $("#J_mobile_login_phone");
				this.jqMobileLoginSend = $("#J_mobile_login_sms_send");
				this.jqMobileLoginSms = $("#J_mobile_login_sms_input");
				this.jqMobileLoginSubmit = $("#J_mobile_login_submit");
				this.jqMobileSecureCode = $("#J-mobile-secure-code");
				this.jqMobileLoginAgree = $("#J_mobile_login_agree");
				this.jqSetPasswordInput = $(".J-set-password__password");
				this.jqSetPasswordInputRepeat = $(".J-set-password__password-repeat");
				this.jqSetPasswordAgree = $("#J-set-password__agree");
				this.jqSetPasswordSubmit = $(".J-set-password__submit");
				this.jqSmsCaptchaComp = $("#J_verify_sms_component");
				this.captchaId = "";
				this.captchaTicket = "";
				this.captchaInstance = null;
				this.passwordLoginSecureCode = null;
				this.mobileLoginSecureCode = null;
				this.hasInterruptLoginByCaptcha = false;
				this.aFormInput = [this.jqLoginName, this.jqLoginPwd, this.jqLoginCaptcha, this
					.jqVpalAgree, this.jqFormError, this.jqMobileLoginPhone, this
					.jqMobileLoginSms, this.jqMobileSecureCode,
					this.jqMobileLoginAgree, this.jqSetPasswordInput, this
					.jqSetPasswordInputRepeat, this.jqSetPasswordAgree
				];
				this.redirectUrl = $.Cookie.get("vipshop_passport_src");
				this.userName = $.Cookie.get("login_username")
			}
		};
		$.Listeners.sub("ready.first").onsuccess(function() {
			marsCid.init();
			config.init();
			fakeA.init();
			Tool.init();
			mars.init();
			document.msCapsLockWarningOff = true;
			if (!!$.Var.get("isShowQr")) getQrImg.init({
				container: ".J-qr",
				qrScanTime: $.Var.get("qrScanTime") || 2E3,
				isShowQrFirst: !!$.Var.get("isShowQrFirst"),
				whereFrom: window.Tool.module.getParamForUrl().whereFrom ||
					"",
				isBSource: !!$.Var.get("isBSource")
			});
			window.Tool.module.showCancelledAccountDialogIfNeed();
			window.Tool.module.showErrorTipsDialogIfNeed();
			window.Tool.module.showSetPasswordAfterChallengeIfNeed();
			marsTracker.initPage()
		})
	}, {
		"../../plugins/ajax": 17,
		"../../plugins/compact.js": 19,
		"../../plugins/md5.js": 21,
		"../../plugins/modules/FakeA": 23,
		"../../plugins/modules/LoginPageMars": 25,
		"../../plugins/modules/validate/mobile": 28,
		"../../plugins/switchEncrypt": 29,
		"./modules/Countdown": 3,
		"./modules/SecureCode/getDataFromFpData": 4,
		"./modules/SecureCode/index": 5,
		"./modules/accoun-trisk.js": 6,
		"./modules/ads.js": 7,
		"./modules/capslock.js": 8,
		"./modules/get-qr-img": 9,
		"./modules/mars.js": 12,
		"./modules/marsCid.js": 13,
		"./modules/password-rules.js": 14,
		"./modules/placeholder.js": 15,
		"@vmr/mars_sdk_web": 31
	}],
	3: [function(require, module, exports) {
		function Countdown() {
			this.init()
		}
		$.extend(Countdown.prototype, {
			init: function() {
				this.isRunning = false;
				this.remindTimeInSeconds = 0;
				this._timer = null
			},
			start: function(timeInSeconds, tickCallback) {
				var that =
					this;
				this.stop();
				this.isRunning = true;
				this.remindTimeInSeconds = timeInSeconds;
				this._timer = setInterval(function() {
					that.remindTimeInSeconds--;
					if (that.remindTimeInSeconds <= 0) that.stop();
					tickCallback && tickCallback()
				}, 1E3);
				tickCallback && tickCallback()
			},
			stop: function() {
				if (this._timer) clearInterval(this._timer);
				this._timer = null;
				this.isRunning = false
			}
		});
		module.exports = Countdown
	}, {}],
	4: [function(require, module, exports) {
		function getDataFromFpData() {
			var data = {};
			try {
				var defaultFp = {
					cid: $.Cookie.get("mars_cid")
				};
				var fpData;
				if (window.VipSecureCode) {
					fpData = VipSecureCode.getFpData();
					if (fpData) {
						var keys = ["version", "canvas", "browser", "screen", "click"];
						var key = "";
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							if (fpData[key]) data[key] = fpData[key]
						}
					} else data = defaultFp
				} else data = defaultFp
			} catch (error) {
				data = {}
			}
			return $.stringifyJSON(data)
		}
		module.exports = getDataFromFpData
	}, {}],
	5: [function(require, module, exports) {
		var getDataFromFpData = require("./getDataFromFpData");

		function SecureCode(options) {
			this.init(options)
		}
		SecureCode.getDataFromFpData =
			getDataFromFpData;
		var CAPTCHA_TYPE_CLICK = 7;
		$.extend(SecureCode.prototype, {
			captchaId: "",
			templateId: "",
			captchaType: "",
			extend: {},
			captchaTicket: "",
			captchaInstance: null,
			targetId: "",
			UI: {
				container: "",
				captchaTip: ".J-captcha-tip"
			},
			status: {
				hidden: "f-hidden",
				isCaptchaTipStickLeftBottom: "is-captcha-tip-stick-left-bottom"
			},
			init: function(options) {
				options = options || {};
				$.extend(this, options);
				this.UI.container = options.container;
				this.initCaptcha()
			},
			isReady: function() {
				return window.VipSecureCode
			},
			initCaptcha: function() {
				var self =
					this;
				if (!window.VipSecureCode) {
					$.Dialog({
						model: true,
						opacity: 0.5,
						size: "small",
						content: "\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5",
						button: [{
							type: "default",
							text: "\u5237\u65b0",
							size: "medium",
							event: function() {
								this.remove();
								window.location.reload()
							}
						}],
						closeEvent: function() {
							this.remove();
							window.location.reload()
						}
					}).open();
					return false
				}
				var loadOpt = {
					url: this.templateId,
					success: function() {
						self.createCaptcha()
					},
					error: function() {}
				};
				window.VipSecureCode.load(loadOpt)
			},
			createCaptcha: function() {
				var self =
					this;
				var createOpt = {
					targetId: this.targetId,
					params: {
						captchaId: this.captchaId,
						templateId: this.templateId,
						captchaType: this.captchaType,
						extend: {}
					},
					label: "none",
					styleConfig: {
						qaInputWidth: 112,
						inputWidth: 112,
						tipsWidth: 250
					},
					onShow: function() {
						var $container = $(self.UI.container);
						$container.removeClass(self.status.hidden);
						if (Number(self.captchaType) === CAPTCHA_TYPE_CLICK) $container
							.find(self.UI.captchaTip).removeClass(self.status
								.isCaptchaTipStickLeftBottom);
						else $container.find(self.UI.captchaTip).addClass(self.status
							.isCaptchaTipStickLeftBottom);
						self.captchaTicket = "";
						self.onShow && self.onShow(self.captchaInstance)
					},
					onImgReload: function() {
						self.captchaTicket = ""
					},
					onPassed: function(res) {
						var ticket = res.data.ticket || "";
						self.captchaTicket = ticket;
						self.onPassed && self.onPassed(res)
					},
					onFailed: function() {
						self.captchaTicket = ""
					},
					onError: function() {
						self.captchaTicket = ""
					},
					onFocus: function() {
						self.configCaptchaTip("")
					}
				};
				if (this.captchaInstance) this.captchaInstance.destroy();
				this.captchaInstance = window.VipSecureCode.createInstance(createOpt);
				this.captchaInstance.show()
			},
			configCaptchaTip: function(tip) {
				$(this.UI.container).find(this.UI.captchaTip).text(tip || "");
				var self = this;
				if (tip) setTimeout(function() {
					$(self.UI.container).find(self.UI.captchaTip).text("")
				}, 3E3)
			},
			isChecking: function() {
				if (!this.captchaInstance) return false;
				var validateResult = this.captchaInstance.validate();
				if (validateResult && Number(validateResult.status) === 120) return true;
				return false
			},
			cleanCaptcha: function() {
				if (this.captchaInstance) this.captchaInstance.destroy();
				this.captchaInstance = null;
				this.captchaId =
					"";
				this.captchaTicket = "";
				this.hasInterruptLoginByCaptcha = false;
				$(this.UI.container).addClass(this.status.hidden)
			}
		});
		module.exports = SecureCode
	}, {
		"./getDataFromFpData": 4
	}],
	6: [function(require, module, exports) {
		module.exports = {
			init: function(cb, oldPwd) {
				if ($("#J_risktips")[0]) return false;
				var that = this;
				that.config = {
					closeFunc: cb,
					oldPwd: oldPwd,
					$mask: $(".ui-window-mask"),
					nickname: $.Cookie.get("VipRNAME") || "",
					username: $.Cookie.get("login_username"),
					capsLock: false,
					timeout: {
						delay: null
					},
					interval: {
						countdown: null
					}
				};
				that.configReset = function() {
					that.config.nickname = $.Cookie.get("VipRNAME") || "", that.config.$risk =
						$("#J_risktips");
					that.config.$mask = $(".ui-window-mask");
					that.config.$risk_pwd = $(".J_risk_pwd");
					that.config.$risk_pwd1 = $("#J_risk_pwd1");
					that.config.$risk_pwd2 = $("#J_risk_pwd2");
					that.config.$show_warn1 = $("#J_show_warn1");
					that.config.$show_warn2 = $("#J_show_warn2");
					that.config.$content = $("#J_risktips_content");
					that.config.$submit = $("#J_submit_editorpwd");
					that.config.$success = $("#J_risk_succ");
					that.config.$fail =
						$("#J_risk_fail");
					that.config.$iknow = $("#J_risk_iknow");
					that.config.$again = $("#J_risk_again");
					that.config.$second = $(".J_risk_second");
					that.config.$close = $(".J_risktips_close");
					that.config.$degree = $("#J_degree")
				};
				that.ui = {
					init: function() {
						that.ui.dialogOpen()
					},
					dialogOpen: function() {
						var _mask = that.config.$mask[0] ? "" :
							'<div class="ui-window-mask"></div>';
						$("body").append($(_mask + $("#J_risktips_tpl").html()));
						that.configReset();
						that.config.$risk.find(".J_risk_username").html(that.config
							.nickname);
						if (window.location.search.indexOf("gotype=2") >=
							0) {
							that.config.$close.removeClass("f-hidden");
							that.config.$risk.addClass("z-dialog-small")
						}
						var left = ($(window).width() - that.config.$risk.width()) / 2,
							top = ($(window).height() - that.config.$risk.height()) / 2;
						that.config.$risk.css({
							"left": left,
							"top": top
						}).addClass("z-ui-dialog-in");
						that.config.$mask.show();
						that.config.$risk_pwd1.parent().placeholder();
						that.config.$risk_pwd2.parent().placeholder()
					},
					dialogClose: function() {
						that.config.$mask.hide();
						that.config.$risk.remove();
						that.config.closeFunc && that.config.closeFunc()
					},
					focuswarn: function(result, iswarn) {
						var red_border_warn = "z-ui-form-item-warning";
						var red_tips_warn = "z-ui-tooltips-in";
						var blue_warn = "z-ui-tooltips-info";
						var $elem = result.elem;
						that.config.$content.find(".z-ui-tooltips-in").removeClass(
							red_tips_warn);
						if (!result.result)
							if (iswarn) {
								$elem.find(".J_err_msg").html(result.tips);
								$elem.removeClass([blue_warn, red_border_warn].join(" "))
									.addClass(red_tips_warn)
							} else {
								$elem.find(".J_warn_msg").html(result.tips);
								$elem.removeClass([red_tips_warn, red_border_warn].join(
									" ")).addClass(blue_warn)
							}
						else $elem.removeClass([red_border_warn,
							red_tips_warn, blue_warn
						].join(" "))
					},
					blurwarn: function(result) {
						var blue_warn = "z-ui-tooltips-info";
						var red_border_warn = "z-ui-form-item-warning";
						var red_tips_warn = "z-ui-tooltips-in";
						if (!result.result) result.elem.removeClass([red_tips_warn,
							blue_warn
						].join(" ")).addClass(red_border_warn);
						else result.elem.removeClass([red_tips_warn, blue_warn,
							red_tips_warn
						].join(" "))
					},
					submitType: function(step) {
						var c_loading = "z-ui-btn-loading";
						var c_disable = "ui-btn-disable";
						that.config.$submit.data("cansubmit", false);
						if (step ==
							0) {
							that.config.$submit.removeClass(c_loading).addClass(c_disable);
							that.config.$content.removeClass("f-hidden");
							that.config.$fail.addClass("f-hidden")
						} else if (step == 1) {
							that.config.$submit.removeClass(c_loading + " " + c_disable);
							that.config.$submit.data("cansubmit", true);
							that.config.$content.removeClass("f-hidden");
							that.config.$fail.addClass("f-hidden")
						} else if (step == 2) that.config.$submit.addClass(c_loading)
							.removeClass(c_disable);
						else if (step == 3) {
							that.config.$content.addClass("f-hidden");
							that.config.$success.removeClass("f-hidden")
						} else if (step ==
							4) {
							that.config.$content.addClass("f-hidden");
							that.config.$fail.removeClass("f-hidden")
						}
					},
					degree: function(lv) {
						var _lv = ["z-step-0", "z-step-1", "z-step-2", "z-step-3"];
						var _type = ["\u5f31", "\u5f31", "\u4e2d", "\u9ad8"];
						that.config.$degree.removeClass(_lv.join(" ")).addClass(_lv[lv]);
						that.config.$degree.find(".u-progess-text").html(_type[lv])
					}
				};
				that.ev = {
					init: function() {
						that.ui.init();
						var _init = ["focus", "blur", "press", "submit", "click"];
						for (var i = 0; i < _init.length; i++) that.ev[_init[i]]()
					},
					checkpwd_1: function(iswarn) {
						var letterPattern =
							/[a-zA-Z]+/,
							numbericPattern = /[0-9]+/,
							specialPattern = /[~!@#$%^&*()_+`\-=\[\]\\{}\|;':",\.\/<>\?]/,
							illegalPattern =
							/[^a-zA-Z0-9~!@#$%^&*()_+`\-=\[\]\\{}\|;':",\.\/<>\?]+/,
							result = new Object,
							pwd = that.config.$risk_pwd1.val(),
							iswarn = iswarn || that.config.$risk_pwd1.data("iswarn"),
							calcCharsCategory = function(pwd) {
								var category = 0;
								if (letterPattern.test(pwd)) category++;
								if (numbericPattern.test(pwd)) category++;
								if (specialPattern.test(pwd)) category++;
								return category
							};
						result.elem = that.config.$show_warn1;
						result.result =
							false;
						result.degree = 0;
						if (pwd && calcCharsCategory(pwd) <= 1) result.degree = 1;
						else if (pwd && (calcCharsCategory(pwd) == 2 && pwd.length < 6))
							result.degree = 1;
						else if (pwd && (calcCharsCategory(pwd) == 2 && (pwd.length >= 6 &&
								pwd.length < 12))) result.degree = 2;
						else if (pwd && (calcCharsCategory(pwd) == 2 && pwd.length >= 12))
							result.degree = 3;
						else if (pwd && (calcCharsCategory(pwd) == 3 && pwd.length < 6))
							result.degree = 1;
						else if (pwd && (calcCharsCategory(pwd) == 3 && (pwd.length >= 6 &&
								pwd.length < 10))) result.degree = 2;
						else if (pwd && (calcCharsCategory(pwd) ==
								3 && pwd.length >= 10)) result.degree = 3;
						if (!pwd && !iswarn) result.tips =
							"\u5bc6\u7801\u4e3a8-20\u4f4d\u5b57\u7b26\uff0c\u5305\u542b\u5b57\u6bcd\u3001\u6570\u5b57\u548c\u7b26\u53f7\u4e2d\u7684\u4e24\u79cd";
						else if (!pwd && iswarn) result.tips =
							"\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a";
						else if (pwd.length < 8) result.tips =
							"\u5bc6\u7801\u4e0d\u80fd\u5c11\u4e8e8\u4f4d";
						else if (illegalPattern.test(pwd)) {
							result.degree = 1;
							result.tips =
								"\u5bc6\u7801\u4e2d\u5305\u542b\u975e\u6cd5\u5b57\u7b26"
						} else if (calcCharsCategory(pwd) <= 1) result.tips =
							"\u5bc6\u7801\u9700\u8981\u5305\u542b\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u7b26\u53f7\u4e2d\u81f3\u5c11\u4e24\u79cd";
						else if (that.config.username == pwd) result.tips =
							"\u5bc6\u7801\u4e0d\u80fd\u4e0e\u767b\u5f55\u540d\u4e00\u81f4";
						else if (that.config.oldPwd == pwd) result.tips =
							"\u65b0\u5bc6\u7801\u4e0d\u80fd\u4e0e\u65e7\u5bc6\u7801\u4e00\u81f4";
						else result.result = true;
						return result
					},
					checkpwd_2: function(iswarn) {
						var result = new Object,
							pwd = that.config.$risk_pwd2.val(),
							iswarn = iswarn || that.config.$risk_pwd2.data("iswarn"),
							rc_pwd = that.config.$risk_pwd1.val();
						result.result = false;
						result.elem = that.config.$show_warn2;
						if (!pwd && !iswarn) result.tips =
							"\u8bf7\u518d\u6b21\u8f93\u5165\u4e0a\u9762\u7684\u5bc6\u7801";
						else if (!pwd && iswarn) result.tips =
							"\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4";
						else if (pwd && rc_pwd != pwd) result.tips =
							"\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4\uff0c\u8bf7\u91cd\u8bd5";
						else if (pwd && rc_pwd == pwd) result.result = true;
						return result
					},
					cansubmit: function() {
						if (that.ev.checkpwd_1().result &&
							that.ev.checkpwd_2().result) return true;
						return false
					},
					delayhide: function(index) {
						that.config.timeout.delay = setTimeout(function() {
							that.ui.focuswarn({
								result: true,
								elem: that.config["$show_warn" + index]
							})
						}, 3E3)
					},
					click: function() {
						that.config.$iknow.click(function() {
							that.ui.dialogClose();
							clearInterval(that.config.interval.countdown)
						});
						that.config.$again.click(function() {
							that.ui.submitType(0);
							that.config.$risk_pwd1.val("");
							that.config.$risk_pwd2.val("");
							that.ui.degree(0);
							clearInterval(that.config.interval.countdown)
						});
						that.config.$close.click(function() {
							that.ui.dialogClose()
						})
					},
					focus: function() {
						that.config.$risk_pwd1.focus(function() {
							var iswarn = that.config.$risk_pwd1.data("iswarn");
							that.config.$degree.removeClass("f-hidden");
							that.ui.focuswarn(that.ev.checkpwd_1(iswarn), iswarn)
						});
						that.config.$risk_pwd2.focus(function() {
							var iswarn = that.config.$risk_pwd2.data("iswarn");
							that.ui.focuswarn(that.ev.checkpwd_2(iswarn), iswarn)
						})
					},
					blur: function() {
						that.config.$risk_pwd1.blur(function() {
							var result = that.ev.checkpwd_1();
							if (!result.result) that.config.$risk_pwd1.data(
								"iswarn",
								true);
							that.ui.blurwarn(result);
							clearTimeout(that.config.timeout.delay)
						});
						that.config.$risk_pwd2.blur(function() {
							var result = that.ev.checkpwd_2();
							if (!result.result) that.config.$risk_pwd2.data(
								"iswarn", true);
							that.ui.blurwarn(result);
							clearTimeout(that.config.timeout.delay)
						})
					},
					press: function() {
						that.config.$risk_pwd.each(function(i, v) {
							(function(i, $elem) {
								var index = i + 1;
								$elem.keypress(function(event) {
									that.config.capsLock = capslock
										.detect(event);
									if (that.config.capsLock) {
										that.ui.focuswarn({
											tips: "\u952e\u76d8\u5927\u5199\u9501\u5b9a\u5df2\u6253\u5f00\uff0c\u8bf7\u6ce8\u610f\u5927\u5c0f\u5199",
											result: false,
											elem: that.config[
												"$show_warn" +
												index]
										});
										that.config["$risk_pwd" + index]
											.data("capsLock", true)
									} else if (that.config["$risk_pwd" +
											index].data("capsLock")) {
										that.ui.focuswarn({
											result: true,
											elem: that.config[
												"$show_warn" +
												index]
										});
										that.config["$risk_pwd" + index]
											.data("capsLock", false)
									} else if (that.config["$risk_pwd" +
											index].data("iswarn")) {
										that.config["$risk_pwd" + index]
											.data("iswarn", false);
										that.ev.delayhide(index)
									}
								});
								that.config["$risk_pwd" + index].keyup(
								function() {
									if (that.ev.cansubmit()) that.ui
										.submitType(1);
									else that.ui.submitType(0)
								});
								that.config["$risk_pwd" + index].keydown(
									function(e) {
										e.stopPropagation()
									})
							})(i, $(v))
						});
						that.config["$risk_pwd1"].keyup(function(e) {
							var val = $(this).val();
							var result = that.ev.checkpwd_1(val);
							that.ui.degree(result.degree);
							var code = e.keyCode;
							if (code == 13) that.config["$risk_pwd2"].focus()
						});
						that.config["$risk_pwd2"].keyup(function(e) {
							var code = e.keyCode;
							if (code == 13) that.config.$submit.trigger("click")
						})
					},
					submitSuccess: function() {
						var time = 3;
						that.config.$second.html(time);
						that.ui.submitType(3);
						that.config["$risk_pwd2"].off("keyup");
						$(document).off("keydown keypress").on("keypress", function(e) {
							var code = e.keyCode;
							if (code == 13) that.config.$iknow.trigger("click")
						});
						that.config.interval.countdown = setInterval(function() {
							time = --time > 0 ? time : 0;
							if (!time) {
								clearInterval(that.config.interval.countdown);
								that.ui.dialogClose()
							}
							that.config.$second.html(time)
						}, 1E3)
					},
					submitFail: function() {
						var time = 3;
						that.config.$second.html(time);
						that.ui.submitType(4);
						that.config.interval.countdown = setInterval(function() {
							time =
								--time > 0 ? time : 0;
							if (!time) {
								clearInterval(that.config.interval.countdown);
								that.ui.dialogClose()
							}
							that.config.$second.html(time)
						}, 1E3)
					},
					submit: function() {
						that.config.$submit.on("click", function() {
							var cansubmit = $(this).data("cansubmit");
							if (cansubmit) {
								var pwd1 = that.config.$risk_pwd1.val();
								var pwd2 = that.config.$risk_pwd2.val();
								that.ui.submitType(2);
								that.data.resetpwd(pwd1, pwd2).done(function(rtn) {
									if (rtn.code == 0) that.ev
										.submitSuccess();
									else that.ev.submitFail()
								}).fail(function() {
									that.ev.submitFail()
								})
							}
						})
					}
				};
				that.data = {
					resetpwd: function(pwd1, pwd2) {
						return $.ajax({
							type: "post",
							url: "https://passport.vip.com/reset_password",
							dataType: "json",
							cache: false,
							data: {
								password: pwd1,
								confirm: pwd2
							}
						})
					}
				};
				that.ev.init()
			}
		}
	}, {}],
	7: [function(require, module, exports) {
		var lcpAd = require("../../../bo/ads/lcpAd.js");
		var template = function(tpl, values) {
			return tpl.replace(/\{\{\s*(.+?)\s*\}\}/g, function(m, v) {
				return values[v] || ""
			})
		};
		var adsMod = {
			api: "//pcapi.vip.com/cmc/index.php?callback=?",
			tpl: '<a href="{{ link }}" target="">{{ content }}</a>',
			data: {
				adData: "",
				config: {
					10007637: "ADADSJ867S"
				}
			},
			init: function() {
				var that = this;
				if (!$(".J-ads").length) return;
				$.Listeners.pub("config.pcapiToLcp").success({
					adsConfig: this.data.config
				});
				lcpAd.init();
				this.bindEventListeners();
				return this
			},
			bindEventListeners: function() {
				var _this = this;
				$.Listeners.sub("get.pcapiAds.list").onsuccess(function(data) {
					_this.fetch("ADSJ867S")
				});
				$.Listeners.sub("get.lcpAds.success").onsuccess(function(data) {
					_this.data.adData = data;
					_this.getDataCB()
				})
			},
			fetch: function(ids) {
				var that =
					this;
				$.getJSON(this.api, {
					type: ids
				}, function(res) {
					that.data.adData = res;
					that.getDataCB()
				})
			},
			getDataCB: function() {
				var that = this;
				if ($(".J-ads").data("bg")) that.bg(this.data.adData);
				else that.render(this.data.adData, $(".J-ads"))
			},
			bg: function(res) {
				for (var k in res) {
					var item = res[k].items[0];
					if (item && item.img) {
						$(".J-ads").css("background-image", "url(" + item.img + ")");
						if (item.alt !== "" && /^#([0-9a-f]{6}|[0-9a-f]{3})$/.test(item.alt)) $(
							".J-ads").css("background-color", item.alt)
					}
				}
			},
			render: function(res, $this) {
				$this.empty();
				var tplel = $this.data("tpl");
				var adtpl = tplel ? $(tplel).html() : this.tpl;
				for (var k in res) {
					var items = res[k].items,
						i, len = items.length;
					for (i = 0; i < len; i++) {
						var item = items[i];
						if (item.img) {
							var imgtpl = '<img src="{{ img }}" alt="{{ name }}" />';
							item.content = template(imgtpl, item)
						} else item.content = item.name;
						var $item = $(template(adtpl, item));
						if (!item.link)
							if ($item.is("a")) $item.removeAttr("href");
							else $item.find("a").removeAttr("href");
						else if (item.blank)
							if ($item.is("a")) $item.attr("target", "_blank");
							else $item.find("a").attr("target",
								"_blank");
						$this.append($item)
					}
				}
			}
		};
		window.adsMod = adsMod;
		module.exports = adsMod
	}, {
		"../../../bo/ads/lcpAd.js": 1
	}],
	8: [function(require, module, exports) {
		(function(root) {
			var capslock = {
				detect: function(e) {
					var valueCapsLock = e.keyCode ? e.keyCode : e.which;
					var valueShift = e.shiftKey ? e.shiftKey : valueCapsLock == 16 ? true :
						false;
					if (valueCapsLock >= 65 && valueCapsLock <= 90 && !valueShift ||
						valueCapsLock >= 97 && valueCapsLock <= 122 && valueShift) return true;
					else return false
				}
			};
			if (typeof define === "function" && define.cmd) define(function(require,
				exports, module) {
				module.exports = capslock
			});
			else root.capslock = capslock;
			$(function() {
				document.msCapsLockWarningOff = true
			})
		})(window)
	}, {}],
	9: [function(require, module, exports) {
		var getQrImg = {
			model: require("./model"),
			view: require("./view"),
			init: function(initData) {
				this.model.init(initData);
				this.view.init(initData)
			}
		};
		module.exports = getQrImg
	}, {
		"./model": 10,
		"./view": 11
	}],
	10: [function(require, module, exports) {
		var getRequest = require("../../../../plugins/modules/http/httpV2");
		var getQrImgModel = {
			api: {
				getQrToken: "https://passport.vip.com/qrLogin/initQrLogin",
				getQrStatus: "https://passport.vip.com/qrLogin/checkStatus"
			},
			apiBSource: {
				getQrToken: "https://passport.vip.com/bLogin/qrLogin/initQrLogin",
				getQrStatus: "https://passport.vip.com/bLogin/qrLogin/checkStatus"
			},
			url: {
				qrImg: "https://passport.vip.com/qrLogin/getQrImage",
				qrImgBSource: "https://passport.vip.com/bLogin/qrLogin/getQrImage"
			},
			event: {
				sub: {
					getQrToken: "get.login.qr.token",
					getQrStatus: "get.login.qr.status",
					setQrStatusPolling: "set.login.qr.status.polling",
					setQrStatusStop: "set.login.qr.status.stop"
				},
				pub: {
					getQrTokenFailure: "get.login.qr.token.failure",
					getQrImgSuccess: "get.login.qr.img.success",
					setQrStatusScanned: "set.login.qr.status.scanned",
					setQrStatusChallenge: "set.login.qr.status.challenge",
					setQrStatusConfirmed: "set.login.qr.status.confirmed",
					setQrStatusInvalid: "set.login.qr.status.invalid",
					setQrStatusFailure: "set.login.qr.status.failure"
				}
			},
			data: {
				qrToken: "",
				whereFrom: "",
				qrScanTime: 2E3,
				isShowQrFirst: false,
				isQrTabItem: false,
				isBSource: false
			},
			init: function(initData) {
				this.data.whereFrom = initData.whereFrom;
				this.data.qrScanTime = initData.qrScanTime;
				this.data.isShowQrFirst = initData.isShowQrFirst;
				this.data.isQrTabItem = initData.isShowQrFirst;
				this.data.isBSource = initData.isBSource;
				this.getToken(this.data.whereFrom);
				this.bindEventListener()
			},
			bindEventListener: function() {
				var that = this;
				$.Listeners.sub(this.event.sub.getQrToken).onsuccess(function() {
					that.getToken(that.data.whereFrom)
				});
				$.Listeners.sub(this.event.sub.getQrStatus).onsuccess(function() {
					that.getStatus(that.data.qrToken, that.data.whereFrom);
					that.data.isQrTabItem = true
				});
				$.Listeners.sub(this.event.sub.setQrStatusStop).onsuccess(function() {
					that.data.isQrTabItem =
						false
				})
			},
			getToken: function(whereFrom) {
				var that = this;
				var data = {};
				if (whereFrom !== "") data.whereFrom = whereFrom;
				getRequest({
					url: this.data.isBSource ? this.apiBSource.getQrToken : this.api
						.getQrToken,
					data: data,
					type: "POST",
					dataType: "json",
					cache: true,
					timeout: 8E3,
					ajaxTryTimes: 1,
					code: "ERROR_GET_QR_TOKEN",
					successCallback: function(result) {
						if (result.code === 200 && result.qrToken !== "") {
							that.getStatus(result.qrToken, that.data.whereFrom);
							that.data.qrToken = result.qrToken;
							that.progressQrImg(result.qrToken)
						} else $.Listeners.pub(that.event.pub.getQrTokenFailure)
							.success({
								errorCode: result.code,
								errorMessage: result.msg
							})
					},
					errorCallback: function() {
						$.Listeners.pub(that.event.pub.getQrTokenFailure).success({
							errorCode: "TIMEOUT",
							errorMessage: "\u63a5\u53e3\u8d85\u65f6"
						})
					}
				})
			},
			getStatus: function(qrToken, whereFrom) {
				var that = this;
				var data = {
					qrToken: qrToken
				};
				if (whereFrom !== "") data.whereFrom = whereFrom;
				getRequest({
					url: this.data.isBSource ? this.apiBSource.getQrStatus : this.api
						.getQrStatus,
					data: data,
					type: "POST",
					dataType: "json",
					cache: true,
					timeout: 8E3,
					ajaxTryTimes: 1,
					code: "ERROR_GET_QR_STATUS",
					successCallback: function(result) {
						if (result.code ===
							200) that.progressGetStatusSuccess(result);
						else $.Listeners.pub(that.event.pub.setQrStatusFailure)
					.success({
							errorCode: result.code,
							errorMessage: result.msg
						})
					},
					errorCallback: function() {
						$.Listeners.pub(that.event.pub.setQrStatusFailure).success({
							errorCode: "TIMEOUT",
							errorMessage: "\u63a5\u53e3\u8d85\u65f6"
						})
					}
				})
			},
			progressGetStatusSuccess: function(data) {
				var qrStatus = data.status;
				var redirectUrl = data.redirectUrl;
				switch (qrStatus) {
					case "NOT_SCANNED":
						this.setPollingRequest(this.data.qrToken, this.data.whereFrom,
							this.data.qrScanTime);
						break;
					case "SCANNED":
						$.Listeners.pub(this.event.pub.setQrStatusScanned).success();
						this.setPollingRequest(this.data.qrToken, this.data.whereFrom, this.data
							.qrScanTime);
						break;
					case "CHALLENGE":
						$.Listeners.pub(this.event.pub.setQrStatusChallenge).success();
						this.setPollingRequest(this.data.qrToken, this.data.whereFrom, this.data
							.qrScanTime);
						break;
					case "CONFIRMED":
						$.Listeners.pub(this.event.pub.setQrStatusConfirmed).success({
							url: redirectUrl
						});
						break;
					case "INVALID":
						$.Listeners.pub(this.event.pub.setQrStatusInvalid).success();
						break;
					default:
				}
			},
			progressQrImg: function(token) {
				var qrImgUrl = (this.data.isBSource ? this.url.qrImgBSource : this.url.qrImg) +
					"?qrToken=" + token;
				$.Listeners.pub(this.event.pub.getQrImgSuccess).success({
					qrImgUrl: qrImgUrl
				})
			},
			setPollingRequest: function(qrToken, whereFrom, intervals) {
				var that = this;
				if (!this.data.isQrTabItem) return;
				setTimeout(function() {
					that.getStatus(qrToken, whereFrom)
				}, intervals)
			}
		};
		module.exports = getQrImgModel
	}, {
		"../../../../plugins/modules/http/httpV2": 27
	}],
	11: [function(require, module, exports) {
		var getQrImgView = {
			UI: {
				container: null
			},
			event: {
				sub: {
					getQrTokenFailure: "get.login.qr.token.failure",
					setQrStatusReset: "set.login.qr.status.reset",
					setQrStatusScanned: "set.login.qr.status.scanned",
					setQrStatusChallenge: "set.login.qr.status.challenge",
					setQrStatusFailure: "set.login.qr.status.failure",
					setQrStatusConfirmed: "set.login.qr.status.confirmed",
					setQrStatusInvalid: "set.login.qr.status.invalid"
				}
			},
			status: {
				isQrScanDefault: "is-qr-scan-default",
				isQrScanSuccess: "is-qr-scan-success",
				isQrScanChallenge: "is-qr-scan-challenge",
				isQrScanFailure: "is-qr-scan-failure",
				isQrScanTimeout: "is-qr-scan-timeout"
			},
			data: {
				isFrame: self !== top
			},
			init: function(initData) {
				this.UI.container = initData.container;
				this.bindEventListener()
			},
			bindEventListener: function() {
				var that = this;
				$.Listeners.sub(this.event.sub.getQrTokenFailure).onsuccess(function() {
					that.setQrStatus(that.status.isQrScanFailure)
				});
				$.Listeners.sub(this.event.sub.setQrStatusReset).onsuccess(function() {
					that.setQrStatus("")
				});
				$.Listeners.sub(this.event.sub.setQrStatusScanned).onsuccess(function() {
					that.setQrStatus(that.status.isQrScanSuccess)
				});
				$.Listeners.sub(this.event.sub.setQrStatusChallenge).onsuccess(function() {
					that.setQrStatus(that.status.isQrScanChallenge)
				});
				$.Listeners.sub(this.event.sub.setQrStatusFailure).onsuccess(function() {
					that.setQrStatus(that.status.isQrScanFailure)
				});
				$.Listeners.sub(this.event.sub.setQrStatusInvalid).onsuccess(function() {
					that.setQrStatus(that.status.isQrScanTimeout)
				});
				$.Listeners.sub(this.event.sub.setQrStatusConfirmed).onsuccess(function(result) {
					that.redirectPage(result.url)
				})
			},
			redirectPage: function(url) {
				var redirectUrl =
					"";
				if (!!url) redirectUrl = url;
				else redirectUrl = this.getRedirectUrl();
				if (this.data.isFrame && $.messenger) $.messenger.send("method=loginSuccess");
				else parent.location.href = redirectUrl
			},
			getRedirectUrl: function() {
				var url = $.Cookie.get("vipshop_passport_src");
				var result = "";
				if (url && !!url) result = url;
				else result = "https://www.vip.com";
				return result
			},
			setQrStatus: function(status) {
				$(this.UI.container).removeClass([this.status.isQrScanDefault, this.status
					.isQrScanTimeout, this.status.isQrScanFailure, this.status
					.isQrScanChallenge,
					this.status.isQrScanSuccess
				].join(" ")).addClass(status)
			}
		};
		module.exports = getQrImgView
	}, {}],
	12: [function(require, module, exports) {
		var Mars = {
			maxHeapHeight: 10,
			hoverHeap: [],
			inputHeap: [],
			init: function() {
				var that = this;
				$("body").delegate("[passport_mars_sead_hover]", "mouseenter", function() {
					that.hoverProcess(this)
				}).delegate("[passport_mars_sead_input]", "keydown", function() {
					that.inputProcess(this)
				})
			},
			hoverProcess: function(target) {
				if (this.hoverHeap.length >= this.maxHeapHeight) this.hoverHeap.pop();
				var c = new Coordinate(getElementLeft(target),
					getElementTop(target));
				var r = new HoverRec(c);
				this.hoverHeap.unshift(r)
			},
			inputProcess: function(target) {
				if (this.inputHeap.length >= this.maxHeapHeight) this.inputHeap.pop();
				var r = new InputRec($(target).attr("passport_mars_sead_input"));
				this.inputHeap.unshift(r)
			},
			send: function() {
				var hasMar = typeof Mar != "undefined" && (typeof Mar.Seed != "undefined" &&
					typeof Mar.Seed.request == "function");
				if (this.hoverHeap.length > 0 && hasMar) Mar.Seed.request("span", "hover",
					"active_login_ck_collect", {
						"platform": "web",
						"data": this.hoverHeap
					});
				if (this.inputHeap.length > 0 && hasMar) Mar.Seed.request("input", "change",
					"active_login_keystroke_collect", {
						"platform": "web",
						"data": this.inputHeap
					})
			}
		};
		var InputRec = function(name) {
			this.t = "" + (new Date).getTime();
			this.x = name
		};
		var HoverRec = function(coordinate) {
			this.t = "" + (new Date).getTime();
			this.position = [{
				"c1": "" + coordinate
			}]
		};
		var Coordinate = function(x, y) {
			this.x = x, this.y = y
		};
		Coordinate.prototype.toString = function() {
			return this.x + ":" + this.y
		};

		function getElementLeft(element) {
			var actualLeft = element.offsetLeft;
			var current = element.offsetParent;
			while (current !== null) {
				actualLeft += current.offsetLeft;
				current = current.offsetParent
			}
			return actualLeft
		}

		function getElementTop(element) {
			var actualTop = element.offsetTop;
			var current = element.offsetParent;
			while (current !== null) {
				actualTop += current.offsetTop;
				current = current.offsetParent
			}
			return actualTop
		}
		module.exports = Mars
	}, {}],
	13: [function(require, module, exports) {
		var Mars = require("./../../../plugins/mars_cids/index");
		var MarsCid = {
			init: function() {
				var mars_cid = $.Cookie.get("mars_cid");
				if (!mars_cid)
					if (Mars.creat) {
						mars_cid = Mars.creat();
						var COOKIE_LIVE = 2 * 365 * 24;
						$.Cookie.set("mars_cid", mars_cid, ".vip.com", "/", COOKIE_LIVE)
					}
			}
		};
		module.exports = MarsCid
	}, {
		"./../../../plugins/mars_cids/index": 20
	}],
	14: [function(require, module, exports) {
		var PasswordRules = {
			letterPattern: /[a-zA-Z]+/,
			numbericPattern: /[0-9]+/,
			specialPattern: /[`~!@#\$%\^&\*\(\)\[\]_\+\-\\=\|\{\}':;',\.<>\/\?"]+/,
			illegalPattern: /[^a-zA-Z0-9`~!@#\$%\^&\*\(\)\[\]_\+\-\\=\|\{\}':;',\.<>\/\?"]+/,
			validate: function(pwd) {
				var len = pwd.length;
				var result = {
					success: false,
					strength: "w",
					message: ""
				};
				if (len < 8) {
					result.message = "\u8bf7\u8f93\u51658-20\u4f4d\u5bc6\u7801";
					return result
				}
				if (len > 20) {
					result.message = "\u8bf7\u8f93\u51658-20\u4f4d\u5bc6\u7801";
					return result
				}
				var category = this.calcCharsCategory(pwd);
				if (category <= 1) {
					result.message =
						"\u5bc6\u7801\u8fc7\u4e8e\u7b80\u5355\uff0c\u6709\u88ab\u76d7\u98ce\u9669\uff0c\u5efa\u8bae\u60a8\u66f4\u6539\u4e3a\u590d\u6742\u5bc6\u7801";
					return result
				}
				if (category === 2)
					if (len >= 8 && len <= 11) {
						result.success = true;
						result.strength =
							"m"
					} else if (len > 11 && len <= 20) {
					result.success = true;
					result.strength = "s"
				} else {
					result.success = false;
					result.strength = "s"
				} else if (len >= 8 && len <= 9) {
					result.success = true;
					result.strength = "m"
				} else if (len > 9 && len <= 20) {
					result.success = true;
					result.strength = "s"
				} else {
					result.success = false;
					result.strength = "s"
				}
				if (this.illegalPattern.test(pwd)) {
					result.success = false;
					result.message = "\u5bc6\u7801\u4e2d\u5305\u542b\u975e\u6cd5\u5b57\u7b26"
				}
				return result
			},
			calcCharsCategory: function(pwd) {
				var category = 0;
				if (this.letterPattern.test(pwd)) category++;
				if (this.numbericPattern.test(pwd)) category++;
				if (this.specialPattern.test(pwd)) category++;
				return category
			}
		};
		module.exports = PasswordRules
	}, {}],
	15: [function(require, module, exports) {
		(function($) {
			var supportPlaceholder = "placeholder" in document.createElement("input");
			var placeholder = function() {
				var $placeholderInputs;
				if (!supportPlaceholder) {
					$placeholderInputs = this.find("input:text, input:password").filter(function() {
						var text = $(this).attr("placeholder");
						return text && text !== ""
					});
					$placeholderInputs.each(function() {
						var $me =
							$(this),
							$placeholderSpan, text = $me.attr("placeholder"),
							spanHtml;
						text = text || "";
						spanHtml = '<span class="ie-placeholder">' + text + "</span>";
						$me.after(spanHtml);
						$placeholderSpan = $me.next(".ie-placeholder");
						$me.on("keydown", function(e) {
							$placeholderSpan.hide()
						});
						$me.on("blur", function(e) {
							var $target = $(e.target);
							var val = $target.val();
							if (val.length === 0) $placeholderSpan.show();
							else $placeholderSpan.hide()
						});
						$placeholderSpan.on("click", function() {
							$me.focus()
						})
					})
				}
				return this
			};
			if (typeof define === "function" && define.cmd) define(function(require,
				exports, module) {
				$.fn.placeholder = placeholder
			});
			else $.fn.placeholder = placeholder
		})(jQuery)
	}, {}],
	16: [function(require, module, exports) {
		var Authorization = {
			wrapCommonData: function(params) {
				return $.extend({}, params, {
					api_key: "70f71280d5d547b2a7bb370a529aeea1"
				})
			},
			getSign: function(url, params) {
				var singString = "";
				try {
					singString = window.sign ? window.sign.getSign(url, params) : ""
				} catch (error) {
					singString = ""
				}
				return singString
			}
		};
		module.exports = Authorization
	}, {}],
	17: [function(require, module, exports) {
		var Http = require("./modules/http/httpV2.js");
		var Authorization = require("../../js/plugins/Authorization");
		var commonFilter = null;
		var config = {
			"default": {
				callbackData: function(r) {
					return r || {}
				}
			},
			"mapi\\.vip\\.com": {
				successCode: [1],
				callbackData: function(r) {
					return r.data || {}
				},
				code: "goods-fav"
			},
			"www\\.vipglobal\\.hk": {
				successCode: [1],
				callbackData: function(r) {
					return r.data || {}
				},
				code: "goods-fav"
			},
			"safe.vip.com": {
				successCode: [200],
				callbackData: function(r) {
					return r.data || {}
				}
			},
			"order.vip.com": {
				successCode: [200],
				callbackData: function(r) {
					return r || {}
				}
			}
		};

		function $ajax(options) {
			var $defer =
				$.Deferred();
			var ajaxConfig = {};
			if (!options.url) throw Error("request url required");
			for (var i in config) {
				var reg = new RegExp(i, "i");
				if (options.url.match(reg)) {
					ajaxConfig = config[i];
					break
				}
			}
			if ($.isEmptyObject(ajaxConfig)) ajaxConfig = config["default"];
			options.isEncrypt = options.isEncrypt || false;
			options.type = options.type || "GET";
			options.timeout = options.timeout || 1E4;
			options.cache = options.cache || false;
			options.data = options.data || {};
			if (!options.cache) try {
				options.data._t = Date.now()
			} catch (e) {}
			delete options.data.m;
			delete options.data.c;
			delete options.data.a;
			var onFail = function(err) {
				$defer.reject(err)
			};
			options.successCallback = function(res) {
				if (!res || ajaxConfig.successCode && $.inArray(res.code, ajaxConfig.successCode) == -1)
					onFail(res);
				else $defer.resolve(ajaxConfig.callbackData(res) || {})
			};
			options.errorCallback = function(xhr, errType, error) {
				onFail(error || {
					message: "\u7f51\u7edc\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5"
				})
			};
			if (options.Authorization) {
				if (options.Authorization === "pc") options.data.api_key = options.data.api_key ||
					"70f71280d5d547b2a7bb370a529aeea1";
				else if (options.Authorization === "wap") options.data.api_key = options.data.api_key ||
					"8cec5243ade04ed3a02c5972bcda0d3f";
				options.headers = {
					"Authorization": Authorization.getSign(options.url, options.data)
				}
			}
			Http(options);
			var myPromise = $defer.promise();
			if ($.isFunction(commonFilter)) myPromise.fail(commonFilter);
			return myPromise
		}

		function setConfig(setting) {
			config = $.extend(config, setting)
		}

		function filter(callback) {
			commonFilter = callback
		}
		var exports = {};
		exports.req = exports.request =
			$ajax;
		exports.filter = filter;
		exports.setConfig = setConfig;
		module.exports = exports
	}, {
		"../../js/plugins/Authorization": 16,
		"./modules/http/httpV2.js": 27
	}],
	18: [function(require, module, exports) {
		var mod = {
			get: function() {
				var userAgent = navigator.userAgent;
				var isOpera = userAgent.indexOf("Opera") > -1;
				var isIE = window.ActiveXObject || "ActiveXObject" in window;
				var isEdge = userAgent.indexOf("Edge") > -1;
				var isFF = userAgent.indexOf("Firefox") > -1;
				var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -
				1;
				var isChrome =
					userAgent.indexOf("Chrome") > -1 && (userAgent.indexOf("Safari") > -1 && !
						isEdge);
				if (isIE) {
					var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
					reIE.test(userAgent);
					var fIEVersion = parseFloat(RegExp["$1"]);
					if (userAgent.indexOf("MSIE 6.0") != -1) return "IE6";
					else if (fIEVersion == 7) return "IE7";
					else if (fIEVersion == 8) return "IE8";
					else if (fIEVersion == 9) return "IE9";
					else if (fIEVersion == 10) return "IE10";
					else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/))
					return "IE11";
					else return "0"
				}
				if (isFF) return "FF";
				if (isOpera) return "Opera";
				if (isSafari) return "Safari";
				if (isChrome) return "Chrome";
				if (isEdge) return "Edge"
			}
		};
		module.exports = mod
	}, {}],
	19: [function(require, module, exports) {
		var browserType = require("./browserType.js");
		var mod = {
			init: function(code) {
				var bType = browserType.get();
				if (bType == "IE6" || (bType == "IE7" || (bType == "IE8" || bType == "IE9")))
					if ($(".J_id_compact_tips2").length < 1) $.Dialog({
						content: '<center><div class = "J_id_compact_tips2 ">\u68c0\u6d4b\u5230\u60a8\u7684\u6d4f\u89c8\u5668\u7248\u672c\u8fc7\u4f4e\uff0c\u4e3a\u4fdd\u8bc1\u60a8\u7684\u6d4f\u89c8\u4f53\u9a8c\uff0c\u8bf7\u5148\u5c06\u6d4f\u89c8\u5668\u5347\u7ea7\u5230\u6700\u65b0\u7248\u672c\u3002</div></center>',
						model: true,
						effect: {
							effect: "slide",
							duration: 200
						},
						opacity: 0.6,
						zIndex: 1E3,
						button: [{
							type: "primary",
							text: "\u6211\u77e5\u9053\u4e86",
							size: "medium",
							event: function() {
								this.close()
							}
						}]
					}).open()
			}
		};
		module.exports = mod
	}, {
		"./browserType.js": 18
	}],
	20: [function(require, module, exports) {
		var Cid = {
			creat: function() {
				var that = this;
				return this.encrypt(that._pad((new Date).getTime(), 13) + "_" + that._rand())
			},
			encrypt: function(timestamp_mar_id) {
				var mar_arr = timestamp_mar_id.split("_");
				var timestamp = mar_arr[0];
				var mar_id = mar_arr[1];
				if (!timestamp || !mar_id) return timestamp_mar_id;
				var timestamp_sum = 0;
				var timestamp_len = timestamp.length;
				for (var i = 0; i < timestamp_len; i++) timestamp_sum += parseInt(timestamp[i]);
				var replace_index = timestamp_sum % 32;
				var dechex_sum = timestamp_sum;
				var mar_id_len = mar_id.length;
				for (var i = 0; i < mar_id_len; i++)
					if (i !== replace_index) dechex_sum += parseInt(mar_id[i], 16);
				var replace_value = (dechex_sum % 16).toString(16);
				return timestamp + "_" + mar_id.substr(0, replace_index) + replace_value
				.toString() + mar_id.substr(replace_index +
						1, mar_id_len)
			},
			_pad: function(num, n) {
				var len = num.toString().length;
				while (len < n) {
					num = "0" + num;
					len++
				}
				return num
			},
			_rand: function(len) {
				var x = "0123456789abcdef",
					tmp = "",
					i = 0;
				len = len || 32;
				for (; i < len; i++) tmp += x.charAt(Math.ceil(Math.random() * 1E8) % x.length);
				return tmp
			}
		};
		module.exports = Cid
	}, {}],
	21: [function(require, module, exports) {
		window.md5 = require("./modules/SecurityPlugin/md5");
		$.Listeners.pub("md5.loaded").success()
	}, {
		"./modules/SecurityPlugin/md5": 26
	}],
	22: [function(require, module, exports) {
		var urlParam = require("./urlParam.js");
		var http = require("./modules/http/httpV2.js");
		var switchMod = {
			getSwitch: function(code) {
				var _this = this,
					dtd = $.Deferred();
				http({
					url: "//mapi.vip.com/vips-mobile/rest/pcoperation/switch/v1",
					data: urlParam.get({
						switch_id: code
					}),
					cache: false,
					dataType: "jsonp",
					type: "GET",
					jsonpCallback: "getPcOperation" + (new Date).getTime() + "_" + Math
						.floor(Math.random() * 1E6),
					timeout: 8E3,
					successCallback: function(re) {
						if (re.code == 1 && re.data) dtd.resolve(re.data);
						else dtd.resolve()
					},
					errorCallback: function() {
						dtd.resolve()
					}
				});
				return dtd.promise()
			}
		};
		module.exports = switchMod
	}, {
		"./modules/http/httpV2.js": 27,
		"./urlParam.js": 30
	}],
	23: [function(require, module, exports) {
		module.exports = {
			init: function() {
				$("body").on("click", ".J_fake_a", function(e) {
					e.preventDefault()
				})
			}
		}
	}, {}],
	24: [function(require, module, exports) {
		var config = {
			loginType: {
				LOGIN_TYPE_QR_CODE: "login_type_qr_code",
				LOGIN_TYPE_PASSWORD: "login_type_password",
				LOGIN_TYPE_MOBILE: "login_type_mobile",
				LOGIN_TYPE_REGISTER: "login_type_register",
				LOGIN_TYPE_CHALLENGE: "login_type_challenge",
				LOGIN_TYPE_OTHER: "login_type_other"
			},
			loginPageType: {
				LOGIN_PAGE_TYPE_NORMAL: "login_page",
				LOGIN_PAGE_TYPE_POP: "login_pop",
				LOGIN_PAGE_TYPE_FULI: "login_fuli",
				LOGIN_PAGE_TYPE_CHALLENGE_CALLBACK: "challenge_callback"
			},
			tabName: {
				TAB_NAME_QR_CODE_LOGIN: "tab_qr_code_login",
				TAB_NAME_PASSWORD_LOGIN: "tab_password_login",
				TAB_NAME_REGISTER: "tab_register"
			}
		};
		module.exports = config
	}, {}],
	25: [function(require, module, exports) {
		var config = require("./config");
		var LoginPageMars = {
			config: config,
			commonParams: {},
			configCommonParams: function(params) {
				$.extend(this.commonParams,
					params || {})
			},
			hasMar: function() {
				return typeof window.Mar != "undefined" && (typeof window.Mar.Seed != "undefined" &&
					typeof window.Mar.Seed.request == "function")
			},
			loginPageShow: function(loginPageType) {
				this.send("PC_login_page_expose", {
					loginPageType: loginPageType
				})
			},
			loginClick: function(loginPageType, loginType) {
				this.send("PC_login_page_login_button_click", {
					loginPageType: loginPageType,
					loginType: loginType
				})
			},
			forgetPasswordClick: function(loginPageType) {
				this.send("PC_login_page_forgot_button_click", {
					loginPageType: loginPageType
				})
			},
			registerClick: function(loginPageType) {
				this.send("PC_login_page_register_button_click", {
					loginPageType: loginPageType
				})
			},
			qrCodeShow: function() {
				this.send("QRcode_PC_page_expose")
			},
			qrCodeRefreshClick: function(loginPageType) {
				this.send("PC_login_page_QRcode_refresh_button")
			},
			tabShow: function(tabName) {
				this.send("PC_login_page_tab_expose", {
					tabName: tabName || ""
				})
			},
			loginSuccess: function(loginType, loginPageType) {
				this.send("PC_login_page_login_succ", {
					loginType: loginType || "",
					loginPageType: loginPageType || ""
				})
			},
			smsClick: function() {
				this.send("PC_login_page_sms_click")
			},
			smsSuccess: function() {
				this.send("PC_login_page_sms_success")
			},
			switchClick: function(targetLoginType) {
				this.send("PC_login_page_switch_click", {
					targetLoginType: targetLoginType
				})
			},
			send: function(actionName, params) {
				if (this.hasMar()) {
					params = $.extend({}, this.commonParams, params || {});
					window.Mar.Seed.request("a", "click", actionName, params)
				}
			}
		};
		module.exports = LoginPageMars
	}, {
		"./config": 24
	}],
	26: [function(require, module, exports) {
		(function($) {
			function safe_add(x, y) {
				var lsw = (x & 65535) + (y & 65535),
					msw = (x >> 16) + (y >> 16) +
					(lsw >> 16);
				return msw << 16 | lsw & 65535
			}

			function bit_rol(num, cnt) {
				return num << cnt | num >>> 32 - cnt
			}

			function md5_cmn(q, a, b, x, s, t) {
				return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
			}

			function md5_ff(a, b, c, d, x, s, t) {
				return md5_cmn(b & c | ~b & d, a, b, x, s, t)
			}

			function md5_gg(a, b, c, d, x, s, t) {
				return md5_cmn(b & d | c & ~d, a, b, x, s, t)
			}

			function md5_hh(a, b, c, d, x, s, t) {
				return md5_cmn(b ^ c ^ d, a, b, x, s, t)
			}

			function md5_ii(a, b, c, d, x, s, t) {
				return md5_cmn(c ^ (b | ~d), a, b, x, s, t)
			}

			function binl_md5(x, len) {
				x[len >> 5] |= 128 << len % 32;
				x[(len +
					64 >>> 9 << 4) + 14] = len;
				var i, olda, oldb, oldc, oldd, a = 1732584193,
					b = -271733879,
					c = -1732584194,
					d = 271733878;
				for (i = 0; i < x.length; i += 16) {
					olda = a;
					oldb = b;
					oldc = c;
					oldd = d;
					a = md5_ff(a, b, c, d, x[i], 7, -680876936);
					d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
					c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
					b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
					a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
					d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
					c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
					b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
					a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
					d = md5_ff(d,
						a, b, c, x[i + 9], 12, -1958414417);
					c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
					b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
					a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
					d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
					c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
					b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
					a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
					d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
					c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
					b = md5_gg(b, c, d, a, x[i], 20, -373897302);
					a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
					d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
					c = md5_gg(c,
						d, a, b, x[i + 15], 14, -660478335);
					b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
					a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
					d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
					c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
					b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
					a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
					d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
					c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
					b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
					a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
					d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
					c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
					b = md5_hh(b,
						c, d, a, x[i + 14], 23, -35309556);
					a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
					d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
					c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
					b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
					a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
					d = md5_hh(d, a, b, c, x[i], 11, -358537222);
					c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
					b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
					a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
					d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
					c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
					b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
					a = md5_ii(a,
						b, c, d, x[i], 6, -198630844);
					d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
					c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
					b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
					a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
					d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
					c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
					b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
					a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
					d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
					c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
					b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
					a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
					d = md5_ii(d,
						a, b, c, x[i + 11], 10, -1120210379);
					c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
					b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
					a = safe_add(a, olda);
					b = safe_add(b, oldb);
					c = safe_add(c, oldc);
					d = safe_add(d, oldd)
				}
				return [a, b, c, d]
			}

			function binl2rstr(input) {
				var i, output = "";
				for (i = 0; i < input.length * 32; i += 8) output += String.fromCharCode(input[i >>
					5] >>> i % 32 & 255);
				return output
			}

			function rstr2binl(input) {
				var i, output = [];
				output[(input.length >> 2) - 1] = undefined;
				for (i = 0; i < output.length; i += 1) output[i] = 0;
				for (i = 0; i < input.length * 8; i += 8) output[i >> 5] |=
					(input.charCodeAt(i / 8) & 255) << i % 32;
				return output
			}

			function rstr_md5(s) {
				return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
			}

			function rstr_hmac_md5(key, data) {
				var i, bkey = rstr2binl(key),
					ipad = [],
					opad = [],
					hash;
				ipad[15] = opad[15] = undefined;
				if (bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);
				for (i = 0; i < 16; i += 1) {
					ipad[i] = bkey[i] ^ 909522486;
					opad[i] = bkey[i] ^ 1549556828
				}
				hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
				return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
			}

			function rstr2hex(input) {
				var hex_tab =
					"0123456789abcdef",
					output = "",
					x, i;
				for (i = 0; i < input.length; i += 1) {
					x = input.charCodeAt(i);
					output += hex_tab.charAt(x >>> 4 & 15) + hex_tab.charAt(x & 15)
				}
				return output
			}

			function str2rstr_utf8(input) {
				return unescape(encodeURIComponent(input))
			}

			function raw_md5(s) {
				return rstr_md5(str2rstr_utf8(s))
			}

			function hex_md5(s) {
				return rstr2hex(raw_md5(s))
			}

			function raw_hmac_md5(k, d) {
				return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))
			}

			function hex_hmac_md5(k, d) {
				return rstr2hex(raw_hmac_md5(k, d))
			}

			function md5(string, key, raw) {
				if (!key) {
					if (!raw) return hex_md5(string);
					return raw_md5(string)
				}
				if (!raw) return hex_hmac_md5(key, string);
				return raw_hmac_md5(key, string)
			}
			if (typeof define === "function" && define.amd) define(function() {
				return md5
			});
			else $.md5 = md5;
			module.exports = md5
		})(this)
	}, {}],
	27: [function(require, module, exports) {
		var Authorization = require("../../../plugins/Authorization");
		var $http = {
			init: function(opt) {
				if (window.AJAX_CACHE == undefined) window.AJAX_CACHE = {};
				this.skey = "3c5ad16dbc06cd16ae1fd3344d87f16b";
				var that = this;
				var requestTime = (new Date).getTime();
				var set = {
					url: "",
					data: {},
					cache: false,
					dataType: "jsonp",
					jsonpCallback: "jsonpCallback",
					type: "GET",
					dataFilter: function(data, type) {
						return data
					},
					timeout: 8E3,
					lock: false,
					preFilter: function(cb) {
						cb()
					},
					filter: null,
					isCache: false,
					cacheKeys: [],
					cacheObj: window.AJAX_CACHE,
					code: "",
					scReport: "",
					event: {
						ajaxLock: "ajax.lock",
						ajaxUnlock: "ajax.unlock"
					},
					headers: {},
					xhrFields: {},
					crossDomain: false,
					successCallback: null,
					errorCallback: null,
					isEncrypt: false,
					ajaxTryTimes: 0
				};
				$.extend(set, opt);
				if (set.filter == null) this.filter = function(rtnData, set, callback) {
					return callback(rtnData)
				};
				else this.filter = opt.filter;
				this.cache = {
					getkey: function(cacheKeys, ajaxParam) {
						var cachekey_list = [];
						$.each(cacheKeys, function(i, key) {
							cachekey_list.push(ajaxParam[key])
						});
						return cachekey_list.join("_")
					},
					get: function(cacheKeys, ajaxParam) {
						var cachekey = this.getkey(cacheKeys, ajaxParam);
						return set.cacheObj[cachekey]
					},
					set: function(cacheKeys, ajaxParam, rtnData) {
						var cachekey = this.getkey(cacheKeys, ajaxParam);
						set.cacheObj[cachekey] = rtnData
					}
				};
				this.ajaxFun = function(set) {
					var data = set.data;
					if (set.isEncrypt) data = this.getEncryptData(set.data);
					var ajaxObj = {
						url: set.url,
						data: data,
						cache: set.cache,
						dataType: set.dataType,
						type: set.type,
						dataFilter: set.dataFilter,
						jsonpCallback: set.jsonpCallback,
						timeout: set.timeout,
						success: function(rtnData, textStatus, jqXHR) {
							if (set.lock) $.Listeners.pub(set.event.ajaxUnlock)
							.success();
							that.filter(rtnData, set, function(successCallbackData) {
								if (set.isCache) that.cache.set(set.cacheKeys,
									set.data, successCallbackData);
								if (set.successCallback != null) set
									.successCallback(successCallbackData)
							});
							if (set.dataType === "jsonp" && (window.VIPSHOP &&
									(window.VIPSHOP.sentry && window.VIPSHOP.sentry
										.sendHttpMessage))) VIPSHOP.sentry
								.sendHttpMessage({
									api_name: set.url,
									request_time: requestTime,
									response_time: (new Date).getTime(),
									status: jqXHR.status,
									request_url: set.url,
									service_code: typeof rtnData.code !=
										"undefined" ? rtnData.code : rtnData.status,
									msg: rtnData.msg || "",
									retryTimes: 0,
									network_mark: 1
								})
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							var errorObj = {
								ext: {
									requestUrl: this.url,
									textStatus: textStatus,
									status: XMLHttpRequest.status
								}
							};
							if (set.lock) $.Listeners.pub(set.event.ajaxUnlock)
							.success();
							if (set.ajaxTryTimes > 0) {
								set.ajaxTryTimes--;
								that.ajaxFun(set)
							} else if (set.errorCallback != null) set.errorCallback(
								XMLHttpRequest, textStatus, errorThrown);
							if (set.code != "") VIPSHOP.report.send && VIPSHOP.report
								.send(set.code, errorObj);
							if (set.dataType === "jsonp" && (window.VIPSHOP && (window
									.VIPSHOP.sentry && window.VIPSHOP.sentry
									.sendHttpMessage))) VIPSHOP.sentry.sendHttpMessage({
								api_name: set.url,
								request_time: requestTime,
								response_time: (new Date).getTime(),
								status: XMLHttpRequest.status,
								request_url: set.url,
								msg: "",
								retryTimes: set.ajaxTryTimes,
								network_mark: 0
							})
						},
						complete: function() {
							set.completeCallback && set.completeCallback()
						}
					};
					if (!$.isEmptyObject(set.xhrFields)) ajaxObj.xhrFields = set.xhrFields;
					if (set.crossDomain) ajaxObj.crossDomain = set.crossDomain;
					if (!$.isEmptyObject(set.headers)) ajaxObj.headers = set.headers;
					$.ajax(ajaxObj)
				};
				this.getEncryptData = function(data) {
					return {
						api_key: data && data.api_key ? data.api_key :
							"70f71280d5d547b2a7bb370a529aeea1",
						pc_eversion: 1,
						skey: this.skey,
						pc_edata: data
					}
				};
				this.encryptAjaxFun = function(set) {
					var _this = this;
					$.Loader.advScript({
						name: "plugin.vipParamsEncrypt",
						url: "//shop.vipstatic.com/js/public/plugins/vipParamsEncrypt-hash-6eee5fbe.js"
					});
					$.Listeners.sub("plugin.vipParamsEncrypt").onsuccess(function() {
						set.data = window.vipParamsEncrypt.encrypt(_this.skey, set
						.data);
						if (set.headers && (set.headers.Authorization && set.isEncrypt))
							set.headers = {
								"Authorization": Authorization.getSign(set.url, _this
									.getEncryptData(set.data))
							};
						that.ajaxFun(set)
					})
				};
				set.preFilter(function() {
					if (set.isCache && that.cache.get(set.cacheKeys, set.data) !=
						undefined) {
						if (set.successCallback != null) {
							var cacheData =
								that.cache.get(set.cacheKeys, set.data);
							set.successCallback(cacheData)
						}
					} else {
						if (set.lock) $.Listeners.pub(set.event.ajaxLock).success();
						if (set.isEncrypt) that.encryptAjaxFun(set);
						else that.ajaxFun(set)
					}
				});
				return this
			}
		};
		var nsHttp = function(opt) {
			$http.init(opt)
		};
		module.exports = nsHttp
	}, {
		"../../../plugins/Authorization": 16
	}],
	28: [function(require, module, exports) {
		var regexMobile = /^1\d{10}$/;
		var mobileValidation = function(mobileNumber) {
			return regexMobile.test(mobileNumber)
		};
		module.exports = {
			regexMobile: regexMobile,
			mobileValidation: mobileValidation
		}
	}, {}],
	29: [function(require, module, exports) {
		var switchEncrypt = {
			getSwitch: function(code) {
				var _this = this,
					dtd = $.Deferred();
				$.ajax({
					url: "//pcapi.vip.com/cc/index.php?code=" + code,
					cache: false,
					type: "GET",
					timeout: 8E3,
					dataType: "json"
				}).done(function(rtn) {
					if (rtn.code == 200 && (rtn.data && !$.isEmptyObject(rtn.data))) dtd
						.resolve(Boolean(rtn.data[code]));
					else dtd.resolve()
				});
				return dtd.promise()
			}
		};
		module.exports = switchEncrypt
	}, {}],
	30: [function(require, module, exports) {
		var urlParamMod = {
			genLocation: function(str) {
				var ary = str.split("&"),
					obj = {};
				$.map(ary, function(item) {
					var r = item.split("=");
					if (r.length) {
						var key = r[0];
						var value;
						try {
							value = decodeURIComponent(r.slice(1, r.length).join("="))
						} catch (e) {
							value = r.slice(1, r.length).join("=")
						}
						obj[key] = value
					}
				});
				return obj
			},
			query: function(key) {
				var obj = this.genLocation(location.search.substr(1));
				if (key) return obj[key];
				return obj
			},
			get: function(addParam) {
				var api_key = "70f71280d5d547b2a7bb370a529aeea1";
				if (window.location && (window.location.host && window.location.host ==
						"www.vipglobal.hk"));
				var address = $.Cookie.get("vip_address") ? $.parseJSON(decodeURIComponent(escape($
						.Cookie.get("vip_address")))) : {},
					areaId = address.sid || (address.did || (address.cid || (address.pid ||
						"104104"))),
					commParam = {
						app_name: "shop_pc",
						app_version: "4.0",
						warehouse: $.Cookie.get("vip_wh") || "VIP_NH",
						fdc_area_id: areaId,
						client: "pc",
						mobile_platform: "1",
						province_id: $.Cookie.get("vip_province") || "104104",
						api_key: api_key,
						user_id: $.Cookie.get("VipRUID"),
						mars_cid: $.Cookie.get("mars_cid") || "shop_pc",
						wap_consumer: UINFO.parseCookie()["luc"] ||
							"a"
					};
				return $.extend(commParam, addParam || {})
			}
		};
		module.exports = urlParamMod
	}, {}],
	31: [function(require, module, exports) {
		! function webpackUniversalModuleDefinition(t, e) {
			"object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" ==
				typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports
				.MarsTracker = e() : t.MarsTracker = e()
		}(window, function() {
			return (o = {}, r.m = n = [function(t, e) {
						var n = t.exports = {
							version: "2.5.7"
						};
						"number" == typeof __e && (__e = n)
					}, function(t, e) {
						var n = t.exports = "undefined" !=
							typeof window && window.Math == Math ? window : "undefined" !=
							typeof self && self.Math == Math ? self : Function("return this")();
						"number" == typeof __g && (__g = n)
					}, function(t, e, n) {
						var r = n(37)("wks"),
							o = n(24),
							i = n(1).Symbol,
							u = "function" == typeof i;
						(t.exports = function(t) {
							return r[t] || (r[t] = u && i[t] || (u ? i : o)("Symbol." + t))
						}).store = r
					}, function(t, e, n) {
						var r = n(5);
						t.exports = function(t) {
							if (!r(t)) throw TypeError(t + " is not an object!");
							return t
						}
					}, function(t, e, n) {
						var v = n(1),
							y = n(0),
							m = n(20),
							_ = n(10),
							g = n(7),
							b = "prototype",
							w = function(t,
								e, n) {
								var r, o, i, u = t & w.F,
									c = t & w.G,
									a = t & w.S,
									s = t & w.P,
									f = t & w.B,
									l = t & w.W,
									p = c ? y : y[e] || (y[e] = {}),
									d = p[b],
									h = c ? v : a ? v[e] : (v[e] || {})[b];
								for (r in c && (n = e), n)(o = !u && (h && h[r] !== undefined)) &&
									g(p, r) || (i = o ? h[r] : n[r], p[r] = c && "function" !=
										typeof h[r] ? n[r] : f && o ? m(i, v) : l && h[r] == i ?
										function(r) {
											function t(t, e, n) {
												if (this instanceof r) {
													switch (arguments.length) {
														case 0:
															return new r;
														case 1:
															return new r(t);
														case 2:
															return new r(t, e)
													}
													return new r(t, e, n)
												}
												return r.apply(this, arguments)
											}
											return t[b] = r[b], t
										}(i) : s && "function" == typeof i ? m(Function.call,
											i) : i, s && ((p.virtual || (p.virtual = {}))[r] = i,
											t & w.R && (d && (!d[r] && _(d, r, i)))))
							};
						w.F = 1, w.G = 2, w.S = 4, w.P = 8, w.B = 16, w.W = 32, w.U = 64, w.R = 128,
							t.exports = w
					}, function(t, e) {
						t.exports = function(t) {
							return "object" == typeof t ? null !== t : "function" == typeof t
						}
					}, function(t, e, n) {
						e.__esModule = !0, e.closest = e.generateCid = e.generateRand = e
							.parseVipuinfo = e.setSessionNo = e.isNumber = e.isArray = e.isObject =
							e.isString = e.isFunction = e.isPlainObject = e.Debounce = undefined;
						var r = o(n(16)),
							a = o(n(33));
						e.json2Object = function u(t) {
							if ("string" == typeof t) try {
								return JSON.parse(t)
							} catch (e) {
								return console.warn("error\uff1a" +
									t + "!!!" + e), !1
							}
						}, e.json2String = function c(t) {
							if ("object" === (void 0 === t ? "undefined" : (0, a["default"])(
								t))) try {
								return (0, r["default"])(t)
							} catch (e) {
								return console.warn("error\uff1a" + t + "!!!" + e), !1
							}
						}, e.getSysteminfo = function s() {
							var t = window.navigator.userAgent.toLocaleLowerCase(),
								e = t.substring(t.indexOf("(") + 1, t.indexOf(")")).split(";"),
								n = " u" === e[1] ? e[2] : e[1],
								r = "unknow",
								o = "else";
							/iphone|ipad|ipod/.test(t) ? (r = "apple", o = "iphone") : r =
								/gt-|sm-|sch-/.test(t) ? "samsung" : /huawei|honor/.test(t) ?
								"huawei" : /hm|redmi|mi/.test(t) ?
								"xiaomi" : /vivo/.test(t) ? "vivo" : /oppo/.test(t) ? "oppo" :
								/one/.test(t) ? "onePlus" : /lenovo/.test(t) ? "lenovo" : /zte/
								.test(t) ? "zte" : /htc/.test(t) ? "htc" : /playbook|bb10/.test(
									t) ? "blackberry" : "else";
							return {
								factory: r,
								model: o,
								os: n,
								clientType: e[0]
							}
						}, e.addEvent = function p(t, e, n) {
							t.attachEvent ? t.attachEvent("on" + e, n) : t.addEventListener(e,
								n, !1)
						};
						var f = o(n(21));

						function o(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						e.Debounce = function(e, n, r) {
							var o, i, u, c, a, s = Date.now || function() {
									return (new Date).getTime()
								},
								f = function f() {
									var t =
										s() - c;
									t < n && 0 <= t ? o = setTimeout(f, n - t) : (o = null, r ||
										(a = e.apply(u, i), o || (u = i = null)))
								};
							return function() {
								u = this, i = arguments, c = s();
								var t = r && !o;
								return o = o || setTimeout(f, n), t && (a = e.apply(u, i),
									u = i = null), a
							}
						}, e.isPlainObject = function(t) {
							var e = [].toString,
								n = Object.prototype.hasOwnProperty,
								r = {
									"[object Boolean]": "bool",
									"[object Number]": "number",
									"[object String]": "string",
									"[object Object]": "object",
									"[object Array]": "array",
									"[object Function]": "function",
									"[object Date]": "date",
									"[object RegExp]": "regExp"
								},
								o = function o(t) {
									return null ===
										t ? String(t) : r[e.call(t)] || "object"
								},
								i = function i(t) {
									return t && ("object" === (void 0 === t ? "undefined" : (0,
										a["default"])(t)) && "setInterval" in t)
								};
							Array.isArray;
							if (!t || ("object" !== o(t) || (i(t) || t.nodeType))) return !1;
							try {
								if (t.constructor && (!n.call(t, "constructor") && !n.call(t
										.constructor.prototype, "isPrototypeOf"))) return !1
							} catch (c) {
								return !1
							}
							var u = void 0;
							for (u in t);
							return u === undefined || n.call(t, u)
						};
						var i = function() {
							for (var t = {}, e = ["String", "Object", "Number", "Array",
										"Undefined", "Function", "Null", "Symbol"
									],
									n = 0; n < e.length; n++) ! function(e) {
								t["Is" + e] = function(t) {
									return Object.prototype.toString.call(t) ==
										"[object " + e + "]"
								}
							}(e[n]);
							return t
						}();
						e.isFunction = i.IsFunction, e.isString = i.IsString, e.isObject = i
							.IsObject, e.isArray = i.IsArray, e.isNumber = i.IsNumber, e
							.setSessionNo = function() {
								var t = ~~f["default"].get("pg_session_no");
								return t ? t += 1 : t = 1, f["default"].set("pg_session_no", t), t
							}, e.parseVipuinfo = function() {
								var t = f["default"].get("VipUINFO");
								if (!t) return "";
								var e = t.split("|"),
									n = {},
									r = 0,
									o = e.length;
								if (2 < o)
									for (; r < o; r++) {
										var i =
											e[r].split(":");
										i[0] && (n[i[0]] = decodeURIComponent(i[1] || ""))
									} else n = {
										luc: e[0] || "",
										suc: e[1] || ""
									};
								return n
							};
						var l = e.generateRand = function l(t) {
							var e = "0123456789abcdef",
								n = "",
								r = 0;
							for (t = t || 32; r < t; r++) n += e.charAt(Math.ceil(1E8 * Math
								.random()) % e.length);
							return n
						};
						e.generateCid = function() {
							for (var t = (new Date).getTime().toString(), e = l(), n = 0, r = t
									.length, o = 0; o < r; o++) n += parseInt(t[o]);
							var i = n % 32,
								u = n,
								c = e.length;
							for (o = 0; o < c; o++) o !== i && (u += parseInt(e[o], 16));
							var a = (u % 16).toString(16),
								s = t + "_" + e.substr(0, i) + a.toString() +
								e.substr(1 + i, c);
							return f["default"].set("mars_cid", s, 7), s
						}, e.closest = function(t, e) {
							for (; t;) {
								if (t.getAttribute(e)) return t;
								t = t.parentElement
							}
						}
					}, function(t, e) {
						var n = {}.hasOwnProperty;
						t.exports = function(t, e) {
							return n.call(t, e)
						}
					}, function(t, e, n) {
						t.exports = !n(13)(function() {
							return 7 != Object.defineProperty({}, "a", {
								get: function() {
									return 7
								}
							}).a
						})
					}, function(t, e, n) {
						var o = n(3),
							i = n(63),
							u = n(41),
							c = Object.defineProperty;
						e.f = n(8) ? Object.defineProperty : function(t, e, n) {
							if (o(t), e = u(e, !0), o(n), i) try {
								return c(t, e, n)
							} catch (r) {}
							if ("get" in
								n || "set" in n) throw TypeError("Accessors not supported!");
							return "value" in n && (t[e] = n.value), t
						}
					}, function(t, e, n) {
						var r = n(9),
							o = n(25);
						t.exports = n(8) ? function(t, e, n) {
							return r.f(t, e, o(1, n))
						} : function(t, e, n) {
							return t[e] = n, t
						}
					}, function(t, e, n) {
						t.exports = {
							"default": n(128),
							__esModule: !0
						}
					}, function(t, e, n) {
						var r = n(61),
							o = n(40);
						t.exports = function(t) {
							return r(o(t))
						}
					}, function(t, e) {
						t.exports = function(t) {
							try {
								return !!t()
							} catch (e) {
								return !0
							}
						}
					}, function(t, e, n) {
						e.__esModule = !0, e["default"] = function(t, e) {
							if (!(t instanceof e)) throw new TypeError(
								"Cannot call a class as a function");
						}
					}, function(t, e) {
						t.exports = {}
					}, function(t, e, n) {
						t.exports = {
							"default": n(123),
							__esModule: !0
						}
					}, function(t, e) {
						t.exports = !0
					}, function(t, e) {
						var n = {}.toString;
						t.exports = function(t) {
							return n.call(t).slice(8, -1)
						}
					}, function(t, e, n) {
						var r = n(62),
							o = n(36);
						t.exports = Object.keys || function(t) {
							return r(t, o)
						}
					}, function(t, e, n) {
						var i = n(26);
						t.exports = function(r, o, t) {
							if (i(r), o === undefined) return r;
							switch (t) {
								case 1:
									return function(t) {
										return r.call(o, t)
									};
								case 2:
									return function(t,
										e) {
										return r.call(o, t, e)
									};
								case 3:
									return function(t, e, n) {
										return r.call(o, t, e, n)
									}
							}
							return function() {
								return r.apply(o, arguments)
							}
						}
					}, function(t, e, n) {
						e.__esModule = !0;
						var r = {
							get: function(t) {
								for (var e = document.cookie ? document.cookie.split(";") :
										[], n = 0; n < e.length; n++) {
									var r = e[n].trim().split("="),
										o = r[0],
										i = decodeURIComponent(r[1]);
									if (t === o) return i
								}
							},
							getAll: function() {
								for (var t = {}, e = document.cookie ? document.cookie
										.split(";") : [], n = 0; n < e.length; n++) {
									var r = e[n].trim().split("="),
										o = r[0],
										i = decodeURIComponent(r[1]);
									t[o] = i
								}
								return t
							},
							set: function(t, e, n) {
								var r = this.getDomain();
								if (n) {
									var o = new Date;
									o.setTime(o.getTime() + 24 * n * 3600 * 1E3), document
										.cookie = t + "=" + encodeURIComponent(e) +
										";expires=" + o.toGMTString() + ";path=/;domain=." +
										r
								} else document.cookie = t + "=" + encodeURIComponent(e) +
									";path=/;domain=." + r
							},
							del: function(t) {
								var e = this.getDomain();
								document.cookie = t +
									"=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/;" + (
										e ? "domain=" + e : "")
							},
							getDomain: function() {
								var t = document.domain && document.domain
									.toLocaleLowerCase();
								return t ? -1 !==
									t.indexOf("vipshop.com") ? "vipshop.com" : -1 !== t
									.indexOf("appvipshop.com") ? "appvipshop.com" : -1 !== t
									.indexOf("vipglobal.hk") ? "vipglobal.hk" : -1 !== t
									.indexOf("vpal.com") ? "vpal.com" : -1 !== t.indexOf(
										"ebatong.com") ? "ebatong.com" : "vip.com" :
									"vip.com"
							}
						};
						e["default"] = r
					}, function(t, e, n) {
						var r = n(9).f,
							o = n(7),
							i = n(2)("toStringTag");
						t.exports = function(t, e, n) {
							t && (!o(t = n ? t : t.prototype, i) && r(t, i, {
								configurable: !0,
								value: e
							}))
						}
					}, function(t, e) {
						e.f = {}.propertyIsEnumerable
					}, function(t, e) {
						var n = 0,
							r = Math.random();
						t.exports = function(t) {
							return "Symbol(".concat(t ===
								undefined ? "" : t, ")_", (++n + r).toString(36))
						}
					}, function(t, e) {
						t.exports = function(t, e) {
							return {
								enumerable: !(1 & t),
								configurable: !(2 & t),
								writable: !(4 & t),
								value: e
							}
						}
					}, function(t, e) {
						t.exports = function(t) {
							if ("function" != typeof t) throw TypeError(t +
								" is not a function!");
							return t
						}
					}, function(t, e, n) {
						var o = n(26);

						function r(t) {
							var n, r;
							this.promise = new t(function(t, e) {
								if (n !== undefined || r !== undefined) throw TypeError(
									"Bad Promise constructor");
								n = t, r = e
							}), this.resolve = o(n), this.reject = o(r)
						}
						t.exports.f = function(t) {
							return new r(t)
						}
					},
					function(t, e, n) {
						t.exports = {
							"default": n(89),
							__esModule: !0
						}
					},
					function(t, e, n) {
						e.__esModule = !0;
						e.URL_FULL_PATH_REG = /^(http(s)?:)?\/\//, e.TRACKER_ATTR =
						"moblie-tracker";
						var r = "//sc.appvipshop.com/vips-mobile-tracker/router.do?service=",
							o = "pc";
						e.TRACKER_SERVER = {
								CLIENT: r + "vip.clientbaseinfo.logger&platform=" + o,
								PAGE: r + "vip.page.logger&platform=" + o,
								ACTIVITY: r + "vip.activityinfo.logger&platform=" + o,
								IMPRESSION: r + "vip.impression.logger&platform=" + o,
								EXCEPTION: r + "h5.exception.logger&platform=" + o
							}, e.TRACKER_TAG = {
								ET_TAP: "tracker-tap",
								ET_EXPOSE: "tracker-expose",
								ET_SLIDE: "tracker-slide",
								ET_LOAD: "tracker-load",
								ET_INTERFACE: "tracker-interface",
								OPTIONS: "data-tracker-option",
								EXPOSE_OPTIONS: "tracker-expose-data",
								CANSEND: "data-canSendMars",
								EXPOSE_SEED: "mars_exposure_sead"
							}, e.MIDDLEWARE_TYPE_COMMON_INFO = "comminfo", e.MIDDLEWARE_TYPE_PAGE =
							"pageTracker", e.MIDDLEWARE_TYPE_ACT = "actTracker", e
							.MIDDLEWARE_TYPE_EXCEPTION = "exceptionTracker", e
							.MIDDLEWARE_TYPE_IMPRESSION = "impressionTracker"
					},
					function(t, e, n) {
						var r = n(1),
							o = n(0),
							i = n(17),
							u = n(31),
							c = n(9).f;
						t.exports = function(t) {
							var e = o.Symbol || (o.Symbol = i ? {} : r.Symbol || {});
							"_" == t.charAt(0) || (t in e || c(e, t, {
								value: u.f(t)
							}))
						}
					},
					function(t, e, n) {
						e.f = n(2)
					},
					function(t, e, r) {
						function o() {}
						var i = r(3),
							u = r(118),
							c = r(36),
							a = r(38)("IE_PROTO"),
							s = "prototype",
							f = function() {
								var t, e = r(42)("iframe"),
									n = c.length;
								for (e.style.display = "none", r(56).appendChild(e), e.src =
									"javascript:", (t = e.contentWindow.document).open(), t.write(
										"<script>document.F=Object\x3c/script>"), t.close(), f = t
									.F; n--;) delete f[s][c[n]];
								return f()
							};
						t.exports = Object.create ||
							function(t, e) {
								var n;
								return null !== t ? (o[s] = i(t), n = new o, o[s] = null, n[a] =
									t) : n = f(), e === undefined ? n : u(n, e)
							}
					},
					function(t, e, n) {
						e.__esModule = !0;
						var r = u(n(122)),
							o = u(n(113)),
							i = "function" == typeof o["default"] && "symbol" == typeof r[
							"default"] ? function(t) {
								return typeof t
							} : function(t) {
								return t && ("function" == typeof o["default"] && (t.constructor ===
										o["default"] && t !== o["default"].prototype)) ? "symbol" :
									typeof t
							};

						function u(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						e["default"] = "function" == typeof o["default"] && "symbol" ===
							i(r["default"]) ? function(t) {
								return void 0 === t ? "undefined" : i(t)
							} : function(t) {
								return t && ("function" == typeof o["default"] && (t.constructor ===
										o["default"] && t !== o["default"].prototype)) ? "symbol" :
									void 0 === t ? "undefined" : i(t)
							}
					},
					function(t, e, n) {
						var r = n(40);
						t.exports = function(t) {
							return Object(r(t))
						}
					},
					function(t, e) {
						e.f = Object.getOwnPropertySymbols
					},
					function(t, e) {
						t.exports =
							"constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf"
							.split(",")
					},
					function(t, e, n) {
						var r = n(0),
							o = n(1),
							i = "__core-js_shared__",
							u = o[i] || (o[i] = {});
						(t.exports = function(t, e) {
							return u[t] || (u[t] = e !== undefined ? e : {})
						})("versions", []).push({
							version: r.version,
							mode: n(17) ? "pure" : "global",
							copyright: "\u00a9 2018 Denis Pushkarev (zloirock.ru)"
						})
					},
					function(t, e, n) {
						var r = n(37)("keys"),
							o = n(24);
						t.exports = function(t) {
							return r[t] || (r[t] = o(t))
						}
					},
					function(t, e) {
						var n = Math.ceil,
							r = Math.floor;
						t.exports = function(t) {
							return isNaN(t = +t) ? 0 : (0 < t ? r : n)(t)
						}
					},
					function(t, e) {
						t.exports = function(t) {
							if (t == undefined) throw TypeError("Can't call method on  " +
								t);
							return t
						}
					},
					function(t, e, n) {
						var o = n(5);
						t.exports = function(t, e) {
							if (!o(t)) return t;
							var n, r;
							if (e && ("function" == typeof(n = t.toString) && !o(r = n.call(
								t)))) return r;
							if ("function" == typeof(n = t.valueOf) && !o(r = n.call(t)))
							return r;
							if (!e && ("function" == typeof(n = t.toString) && !o(r = n.call(
									t)))) return r;
							throw TypeError("Can't convert object to primitive value");
						}
					},
					function(t, e, n) {
						var r = n(5),
							o = n(1).document,
							i = r(o) && r(o.createElement);
						t.exports = function(t) {
							return i ? o.createElement(t) : {}
						}
					},
					function(t, e, n) {
						e.__esModule = !0;
						var r = {
							parseURL: function(t) {
								var i = document.createElement("a");
								return {
									source: i.href = t,
									protocol: i.protocol.replace(":", ""),
									host: i.hostname,
									port: i.port,
									query: i.search,
									params: function() {
										for (var t, e = {}, n = decodeURIComponent(i
												.search).replace(/^\?/, "").split(
												"&"), r = n.length, o = 0; o < r; o++)
											n[o] && (e[(t = n[o].split("="))[0]] = t[
											1]);
										return e
									}(),
									file: (i.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
									hash: i.hash.replace("#", ""),
									path: i.pathname.replace(/^([^\/])/, "/$1"),
									relative: (i.href.match(/tps?:\/\/[^\/]+(.+)/) || [,
										""])[1],
									segments: i.pathname.replace(/^\//, "").split("/")
								}
							},
							getQueryStringByName: function(t, e) {
								var n = e.match(new RegExp("[?&]" + t + "=([^&^#]+)", "i"));
								return null == n || n.length < 1 ? "" : n[1]
							}
						};
						e["default"] = r
					},
					function(t, e, n) {
						t.exports = {
							"default": n(73),
							__esModule: !0
						}
					},
					function(t, e, n) {
						e.__esModule = !0;
						var r = function i(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}(n(44));
						e.isSupportPassive = function u() {
							return supportsPassive
						}, e.prepareFormData = l, e.param = function c(t, e) {
							var n = [];
							return n.add = function(t, e) {
								(0, f.isFunction)(e) &&
								(e = e()), null == e && (e = ""), this.push([t, e])
							}, l(n, t, e), n.map(function(t) {
								var e = t[0],
									n = t[1];
								return o(e) + "=" + o(n)
							}).join("&").replace(/%20/g, "+")
						}, e.appendQuery = function a(t, e) {
							return "" == e ? t : (t + "&" + e).replace(/[&?]{1,2}/, "?")
						};
						var f = n(6);
						var o = encodeURIComponent;

						function l(o, i, u, c) {
							var a = (0, f.isArray)(i),
								s = (0, f.isObject)(i);
							(0, r["default"])(i).forEach(function(t) {
								var e = i[t],
									n = (0, f.isArray)(e),
									r = (0, f.isObject)(e);
								c && (t = u ? c : c + "[" + (s || (r || n) ? t : "") + "]"),
									!c && a ? o.add(e.name, e.value) : n || !u && r ? l(o,
										e, u, t) : o.add(t,
										e)
							})
						}
					},
					function(t, e, n) {
						var r = n(3),
							o = n(5),
							i = n(27);
						t.exports = function(t, e) {
							if (r(t), o(e) && e.constructor === t) return e;
							var n = i.f(t);
							return (0, n.resolve)(e), n.promise
						}
					},
					function(t, e) {
						t.exports = function(t) {
							try {
								return {
									e: !1,
									v: t()
								}
							} catch (e) {
								return {
									e: !0,
									v: e
								}
							}
						}
					},
					function(t, e, n) {
						function r() {
							var t = +this;
							if (g.hasOwnProperty(t)) {
								var e = g[t];
								delete g[t], e()
							}
						}

						function o(t) {
							r.call(t.data)
						}
						var i, u, c, a = n(20),
							s = n(82),
							f = n(56),
							l = n(42),
							p = n(1),
							d = p.process,
							h = p.setImmediate,
							v = p.clearImmediate,
							y = p.MessageChannel,
							m = p.Dispatch,
							_ = 0,
							g = {},
							b = "onreadystatechange";
						h && v || (h = function(t) {
							for (var e = [], n = 1; n < arguments.length;) e.push(arguments[
								n++]);
							return g[++_] = function() {
								s("function" == typeof t ? t : Function(t), e)
							}, i(_), _
						}, v = function(t) {
							delete g[t]
						}, "process" == n(18)(d) ? i = function(t) {
							d.nextTick(a(r, t, 1))
						} : m && m.now ? i = function(t) {
							m.now(a(r, t, 1))
						} : y ? (c = (u = new y).port2, u.port1.onmessage = o, i = a(c
							.postMessage, c, 1)) : p.addEventListener && ("function" ==
							typeof postMessage && !p.importScripts) ? (i = function(t) {
							p.postMessage(t + "", "*")
						}, p.addEventListener("message",
							o, !1)) : i = b in l("script") ? function(t) {
							f.appendChild(l("script"))[b] = function() {
								f.removeChild(this), r.call(t)
							}
						} : function(t) {
							setTimeout(a(r, t, 1), 0)
						}), t.exports = {
							set: h,
							clear: v
						}
					},
					function(t, e, n) {
						var o = n(3),
							i = n(26),
							u = n(2)("species");
						t.exports = function(t, e) {
							var n, r = o(t).constructor;
							return r === undefined || (n = o(r)[u]) == undefined ? e : i(n)
						}
					},
					function(t, e, n) {
						var o = n(18),
							i = n(2)("toStringTag"),
							u = "Arguments" == o(function() {
								return arguments
							}());
						t.exports = function(t) {
							var e, n, r;
							return t === undefined ? "Undefined" : null ===
								t ? "Null" : "string" == typeof(n = function(t, e) {
									try {
										return t[e]
									} catch (n) {}
								}(e = Object(t), i)) ? n : u ? o(e) : "Object" == (r = o(e)) &&
								"function" == typeof e.callee ? "Arguments" : r
						}
					},
					function(t, e, n) {
						e.__esModule = !0;
						e.handleCommonData = function(t, e) {
							var n = t;
							return n.switcher = n.switcher === undefined || n.switcher, n
						}
					},
					function(t, e) {},
					function(t, e, n) {
						var r = n(23),
							o = n(25),
							i = n(12),
							u = n(41),
							c = n(7),
							a = n(63),
							s = Object.getOwnPropertyDescriptor;
						e.f = n(8) ? s : function(t, e) {
							if (t = i(t), e = u(e, !0), a) try {
								return s(t, e)
							} catch (n) {}
							if (c(t, e)) return o(!r.f.call(t,
								e), t[e])
						}
					},
					function(t, e, n) {
						var r = n(62),
							o = n(36).concat("length", "prototype");
						e.f = Object.getOwnPropertyNames || function(t) {
							return r(t, o)
						}
					},
					function(t, e, n) {
						n(116);
						for (var r = n(1), o = n(10), i = n(15), u = n(2)("toStringTag"), c =
								"CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList"
								.split(","),
								a = 0; a < c.length; a++) {
							var s = c[a],
								f = r[s],
								l = f && f.prototype;
							l && (!l[u] && o(l, u, s)), i[s] = i.Array
						}
					},
					function(t, e, n) {
						var r = n(1).document;
						t.exports = r && r.documentElement
					},
					function(t, e, n) {
						t.exports = n(10)
					},
					function(t, e, n) {
						function g() {
							return this
						}
						var b = n(17),
							w = n(4),
							x = n(57),
							O = n(10),
							S = n(15),
							E = n(119),
							j = n(22),
							T = n(117),
							M = n(2)("iterator"),
							P = !([].keys && "next" in [].keys()),
							R = "values";
						t.exports = function(t, e, n, r, o, i, u) {
							E(n, e, r);

							function c(t) {
								if (!P && t in h) return h[t];
								switch (t) {
									case "keys":
									case R:
										return function() {
											return new n(this,
												t)
										}
								}
								return function() {
									return new n(this, t)
								}
							}
							var a, s, f, l = e + " Iterator",
								p = o == R,
								d = !1,
								h = t.prototype,
								v = h[M] || (h["@@iterator"] || o && h[o]),
								y = v || c(o),
								m = o ? p ? c("entries") : y : undefined,
								_ = "Array" == e && h.entries || v;
							if (_ && ((f = T(_.call(new t))) !== Object.prototype && (f.next &&
									(j(f, l, !0), b || ("function" == typeof f[M] || O(f, M,
										g))))), p && (v && (v.name !== R && (d = !0, y =
									function() {
										return v.call(this)
									}))), b && !u || (!P && (!d && h[M]) || O(h, M, y)), S[e] =
								y, S[l] = g, o)
								if (a = {
										values: p ? y : c(R),
										keys: i ? y : c("keys"),
										entries: m
									}, u)
									for (s in a) s in h || x(h, s,
										a[s]);
								else w(w.P + w.F * (P || d), e, a);
							return a
						}
					},
					function(t, e, n) {
						var r = n(120)(!0);
						n(58)(String, "String", function(t) {
							this._t = String(t), this._i = 0
						}, function() {
							var t, e = this._t,
								n = this._i;
							return n >= e.length ? {
								value: undefined,
								done: !0
							} : (t = r(e, n), this._i += t.length, {
								value: t,
								done: !1
							})
						})
					},
					function(t, e, n) {
						var r = n(39),
							o = Math.min;
						t.exports = function(t) {
							return 0 < t ? o(r(t), 9007199254740991) : 0
						}
					},
					function(t, e, n) {
						var r = n(18);
						t.exports = Object("z").propertyIsEnumerable(0) ? Object : function(t) {
							return "String" == r(t) ? t.split("") : Object(t)
						}
					},
					function(t, e, n) {
						var u = n(7),
							c = n(12),
							a = n(125)(!1),
							s = n(38)("IE_PROTO");
						t.exports = function(t, e) {
							var n, r = c(t),
								o = 0,
								i = [];
							for (n in r) n != s && (u(r, n) && i.push(n));
							for (; e.length > o;) u(r, n = e[o++]) && (~a(i, n) || i.push(n));
							return i
						}
					},
					function(t, e, n) {
						t.exports = !n(8) && !n(13)(function() {
							return 7 != Object.defineProperty(n(42)("div"), "a", {
								get: function() {
									return 7
								}
							}).a
						})
					},
					function(t, e, n) {
						e.__esModule = !0;
						var o = r(n(44));
						e.getChannelData = function c() {
							0 < arguments.length && undefined;
							var t = i["default"].parseURL(window.location.href).params,
								e = t.chl_type || "",
								n = t.tra_from || (t.cps_from || (t.chl_info || "")),
								r = (0, o["default"])(t).length ? (0, u.json2String)(t) : "";
							return {
								chl_type: encodeURIComponent(decodeURIComponent(e)),
								chl_info: encodeURIComponent(decodeURIComponent(n)),
								chl_param: encodeURIComponent(r)
							}
						};
						var i = r(n(43)),
							u = n(6);

						function r(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
					},
					function(t, e, n) {
						e.__esModule = !0;
						var m = r(n(11)),
							_ = r(n(16)),
							g = r(n(21)),
							b = r(n(43)),
							w = n(6),
							x = n(64);

						function r(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						var O = function O(t) {
								var e,
									n = b["default"].parseURL(window.location.href).params,
									r = navigator.userAgent,
									o = g["default"].getAll(),
									i = n.mars_cid || (o.mars_cid || (0, w.generateCid)()),
									u = o.mars_sid ? o.mars_sid : (e = (0, w.generateRand)(), g[
										"default"].set("mars_sid", e, 7), e),
									c = {
										cookie_id: i,
										user_agent: encodeURIComponent(r)
									},
									a = {
										app_type: "web",
										app_name: "shop_web",
										session_id: u
									},
									s = (0, x.getChannelData)(),
									f = {
										user_id: n.vipruid || o.VipRUID,
										user_class: n.user_class || ((0, w.parseVipuinfo)().luc ||
											""),
										user_label: n.user_label || ((0, w.parseVipuinfo)().ul ||
											"")
									},
									l = (new Date).getTime(),
									p = {
										page_url: encodeURIComponent(location.href),
										refer_url: encodeURIComponent(document.referrer),
										stream_id: l
									},
									d = {
										timestamp: l
									},
									h = (0, w.getSysteminfo)(r),
									v = {
										warehouse: n.warehouse || (o.vip_wh || (o["WAP[p_wh]"] ||
											"VIP_NH")),
										factory: h.factory,
										model: h.model,
										os: h.os,
										wapid: n.wapid,
										client: n.client,
										method: navigator.sendBeacon ? "beacon" : "ajax"
									};
								"1" === n.nova && (v.isNova = "1", v.special_id = n.special_id, v
									._src = n._src);
								var y = {
									ext_info: encodeURIComponent((0, _["default"])(v))
								};
								return "moniter" === t ? (0, m["default"])(c,
									a, f, s, d) : (0, m["default"])(c, a, f, s, d, p, y)
							},
							o = {
								"default": O("def"),
								moniter: O("moniter")
							};
						e["default"] = o
					},
					function(t, e) {
						"function" == typeof Object.create ? t.exports = function(t, e) {
							t.super_ = e, t.prototype = Object.create(e.prototype, {
								constructor: {
									value: t,
									enumerable: !1,
									writable: !0,
									configurable: !0
								}
							})
						} : t.exports = function(t, e) {
							t.super_ = e;

							function n() {}
							n.prototype = e.prototype, t.prototype = new n, t.prototype
								.constructor = t
						}
					},
					function(t, e) {
						t.exports = function(t) {
							return t && ("object" == typeof t && ("function" == typeof t.copy &&
								("function" == typeof t.fill && "function" == typeof t
									.readUInt8)))
						}
					},
					function(t, e) {
						var n, r, o = t.exports = {};

						function i() {
							throw new Error("setTimeout has not been defined");
						}

						function u() {
							throw new Error("clearTimeout has not been defined");
						}

						function c(t) {
							if (n === setTimeout) return setTimeout(t, 0);
							if ((n === i || !n) && setTimeout) return n = setTimeout, setTimeout(t,
								0);
							try {
								return n(t, 0)
							} catch (e) {
								try {
									return n.call(null, t, 0)
								} catch (e) {
									return n.call(this, t, 0)
								}
							}
						}! function() {
							try {
								n = "function" == typeof setTimeout ? setTimeout : i
							} catch (t) {
								n =
									i
							}
							try {
								r = "function" == typeof clearTimeout ? clearTimeout : u
							} catch (t) {
								r = u
							}
						}();
						var a, s = [],
							f = !1,
							l = -1;

						function p() {
							f && (a && (f = !1, a.length ? s = a.concat(s) : l = -1, s.length &&
							d()))
						}

						function d() {
							if (!f) {
								var t = c(p);
								f = !0;
								for (var e = s.length; e;) {
									for (a = s, s = []; ++l < e;) a && a[l].run();
									l = -1, e = s.length
								}
								a = null, f = !1,
									function n(t) {
										if (r === clearTimeout) return clearTimeout(t);
										if ((r === u || !r) && clearTimeout) return r =
											clearTimeout, clearTimeout(t);
										try {
											return r(t)
										} catch (e) {
											try {
												return r.call(null, t)
											} catch (e) {
												return r.call(this, t)
											}
										}
									}(t)
							}
						}

						function h(t,
							e) {
							this.fun = t, this.array = e
						}

						function v() {}
						o.nextTick = function(t) {
								var e = new Array(arguments.length - 1);
								if (1 < arguments.length)
									for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[
										n];
								s.push(new h(t, e)), 1 !== s.length || (f || c(d))
							}, h.prototype.run = function() {
								this.fun.apply(null, this.array)
							}, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o
							.version = "", o.versions = {}, o.on = v, o.addListener = v, o.once = v,
							o.off = v, o.removeListener = v, o.removeAllListeners = v, o.emit = v, o
							.prependListener = v, o.prependOnceListener = v, o.listeners =
							function(t) {
								return []
							}, o.binding = function(t) {
								throw new Error("process.binding is not supported");
							}, o.cwd = function() {
								return "/"
							}, o.chdir = function(t) {
								throw new Error("process.chdir is not supported");
							}, o.umask = function() {
								return 0
							}
					},
					function(t, I, A) {
						(function(u) {
							var o = Object.getOwnPropertyDescriptors || function o(t) {
									for (var e = Object.keys(t), n = {}, r = 0; r < e
										.length; r++) n[e[r]] = Object.getOwnPropertyDescriptor(
										t, e[r]);
									return n
								},
								c = /%[sdj%]/g;
							I.format = function(t) {
								if (!O(t)) {
									for (var e = [], n = 0; n < arguments.length; n++) e
										.push(a(arguments[n]));
									return e.join(" ")
								}
								n = 1;
								for (var r = arguments, o = r.length, i = String(t).replace(
										c,
										function(t) {
											if ("%%" === t) return "%";
											if (o <= n) return t;
											switch (t) {
												case "%s":
													return String(r[n++]);
												case "%d":
													return Number(r[n++]);
												case "%j":
													try {
														return JSON.stringify(r[n++])
													} catch (e) {
														return "[Circular]"
													}
													default:
														return t
											}
										}), u = r[n]; n < o; u = r[++n]) w(u) || !f(u) ?
									i += " " + u : i += " " + a(u);
								return i
							}, I.deprecate = function(t, e) {
								if (void 0 !== u && !0 === u.noDeprecation) return t;
								if (void 0 === u) return function() {
									return I.deprecate(t, e).apply(this, arguments)
								};
								var n = !1;
								return function r() {
									if (!n) {
										if (u.throwDeprecation) throw new Error(e);
										u.traceDeprecation ? console.trace(e) : console
											.error(e), n = !0
									}
									return t.apply(this, arguments)
								}
							};
							var t, r = {};

							function a(t, e) {
								var n = {
									seen: [],
									stylize: s
								};
								return 3 <= arguments.length && (n.depth = arguments[2]), 4 <=
									arguments.length && (n.colors = arguments[3]), b(e) ? n
									.showHidden = e : e && I._extend(n, e), S(n.showHidden) && (
										n.showHidden = !1), S(n.depth) && (n.depth = 2), S(n
										.colors) && (n.colors = !1), S(n.customInspect) && (n
										.customInspect = !0), n.colors && (n.stylize =
										i), y(n, t, n.depth)
							}

							function i(t, e) {
								var n = a.styles[e];
								return n ? "\u001b[" + a.colors[n][0] + "m" + t + "\u001b[" + a
									.colors[n][1] + "m" : t
							}

							function s(t, e) {
								return t
							}

							function y(e, n, r) {
								if (e.customInspect && (n && (M(n.inspect) && (n.inspect !== I
										.inspect && (!n.constructor || n.constructor
											.prototype !== n))))) {
									var t = n.inspect(r, e);
									return O(t) || (t = y(e, t, r)), t
								}
								var o = function p(t, e) {
									if (S(e)) return t.stylize("undefined", "undefined");
									if (O(e)) {
										var n = "'" + JSON.stringify(e).replace(/^"|"$/g,
											"").replace(/'/g, "\\'").replace(/\\"/g,
											'"') + "'";
										return t.stylize(n, "string")
									}
									if (x(e)) return t.stylize("" + e, "number");
									if (b(e)) return t.stylize("" + e, "boolean");
									if (w(e)) return t.stylize("null", "null")
								}(e, n);
								if (o) return o;
								var i = Object.keys(n),
									u = function d(t) {
										var n = {};
										return t.forEach(function(t, e) {
											n[t] = !0
										}), n
									}(i);
								if (e.showHidden && (i = Object.getOwnPropertyNames(n)), T(n) &&
									(0 <= i.indexOf("message") || 0 <= i.indexOf("description"))
									) return m(n);
								if (0 === i.length) {
									if (M(n)) {
										var c = n.name ? ": " + n.name : "";
										return e.stylize("[Function" + c + "]", "special")
									}
									if (E(n)) return e.stylize(RegExp.prototype.toString.call(
										n),
										"regexp");
									if (j(n)) return e.stylize(Date.prototype.toString.call(n),
										"date");
									if (T(n)) return m(n)
								}
								var a, s = "",
									f = !1,
									l = ["{", "}"];
								g(n) && (f = !0, l = ["[", "]"]), M(n) && (s = " [Function" + (n
									.name ? ": " + n.name : "") + "]");
								return E(n) && (s = " " + RegExp.prototype.toString.call(n)), j(
										n) && (s = " " + Date.prototype.toUTCString.call(n)), T(
										n) && (s = " " + m(n)), 0 !== i.length || f && 0 != n
									.length ? r < 0 ? E(n) ? e.stylize(RegExp.prototype.toString
										.call(n), "regexp") : e.stylize("[Object]", "special") :
									(e.seen.push(n), a = f ? function h(e, n, r, o, t) {
										for (var i = [],
												u = 0, c = n.length; u < c; ++u) P(n,
											String(u)) ? i.push(_(e, n, r, o, String(u),
											!0)) : i.push("");
										return t.forEach(function(t) {
											t.match(/^\d+$/) || i.push(_(e, n, r, o,
												t, !0))
										}), i
									}(e, n, r, u, i) : i.map(function(t) {
										return _(e, n, r, u, t, f)
									}), e.seen.pop(), function v(t, e, n) {
										if (60 < t.reduce(function(t, e) {
												return 0, 0 <= e.indexOf("\n") && 0, t +
													e.replace(/\u001b\[\d\d?m/g, "")
													.length + 1
											}, 0)) return n[0] + ("" === e ? "" : e +
											"\n ") + " " + t.join(",\n  ") + " " + n[1];
										return n[0] + e + " " + t.join(", ") + " " + n[1]
									}(a, s, l)) : l[0] + s + l[1]
							}

							function m(t) {
								return "[" + Error.prototype.toString.call(t) +
									"]"
							}

							function _(t, e, n, r, o, i) {
								var u, c, a;
								if ((a = Object.getOwnPropertyDescriptor(e, o) || {
										value: e[o]
									}).get ? c = a.set ? t.stylize("[Getter/Setter]",
									"special") : t.stylize("[Getter]", "special") : a.set && (
										c = t.stylize("[Setter]", "special")), P(r, o) || (u =
										"[" + o + "]"), c || (t.seen.indexOf(a.value) < 0 ? -1 <
										(c = w(n) ? y(t, a.value, null) : y(t, a.value, n - 1))
										.indexOf("\n") && (c = i ? c.split("\n").map(function(
										t) {
											return "  " + t
										}).join("\n").substr(2) : "\n" + c.split("\n").map(
											function(t) {
												return "   " + t
											}).join("\n")) : c = t.stylize("[Circular]",
											"special")),
									S(u)) {
									if (i && o.match(/^\d+$/)) return c;
									u = (u = JSON.stringify("" + o)).match(
										/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (u = u.substr(1, u
										.length - 2), t.stylize(u, "name")) : (u = u
										.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(
											/(^"|"$)/g, "'"), t.stylize(u, "string"))
								}
								return u + ": " + c
							}

							function g(t) {
								return Array.isArray(t)
							}

							function b(t) {
								return "boolean" == typeof t
							}

							function w(t) {
								return null === t
							}

							function x(t) {
								return "number" == typeof t
							}

							function O(t) {
								return "string" == typeof t
							}

							function S(t) {
								return void 0 === t
							}

							function E(t) {
								return f(t) &&
									"[object RegExp]" === e(t)
							}

							function f(t) {
								return "object" == typeof t && null !== t
							}

							function j(t) {
								return f(t) && "[object Date]" === e(t)
							}

							function T(t) {
								return f(t) && ("[object Error]" === e(t) || t instanceof Error)
							}

							function M(t) {
								return "function" == typeof t
							}

							function e(t) {
								return Object.prototype.toString.call(t)
							}

							function l(t) {
								return t < 10 ? "0" + t.toString(10) : t.toString(10)
							}
							I.debuglog = function(e) {
									if (S(t) && (t = u.env.NODE_DEBUG || ""), e = e
										.toUpperCase(), !r[e])
										if ((new RegExp("\\b" + e + "\\b", "i")).test(t)) {
											var n = u.pid;
											r[e] = function() {
												var t =
													I.format.apply(I, arguments);
												console.error("%s %d: %s", e, n, t)
											}
										} else r[e] = function() {};
									return r[e]
								}, (I.inspect = a).colors = {
									bold: [1, 22],
									italic: [3, 23],
									underline: [4, 24],
									inverse: [7, 27],
									white: [37, 39],
									grey: [90, 39],
									black: [30, 39],
									blue: [34, 39],
									cyan: [36, 39],
									green: [32, 39],
									magenta: [35, 39],
									red: [31, 39],
									yellow: [33, 39]
								}, a.styles = {
									special: "cyan",
									number: "yellow",
									"boolean": "yellow",
									undefined: "grey",
									"null": "bold",
									string: "green",
									date: "magenta",
									regexp: "red"
								}, I.isArray = g, I.isBoolean = b, I.isNull = w, I
								.isNullOrUndefined = function h(t) {
									return null ==
										t
								}, I.isNumber = x, I.isString = O, I.isSymbol = function v(t) {
									return "symbol" == typeof t
								}, I.isUndefined = S, I.isRegExp = E, I.isObject = f, I.isDate =
								j, I.isError = T, I.isFunction = M, I.isPrimitive = function R(
									t) {
									return null === t || ("boolean" == typeof t || ("number" ==
										typeof t || ("string" == typeof t || (
											"symbol" == typeof t || void 0 === t))))
								}, I.isBuffer = A(67);
							var p = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
								"Sep", "Oct", "Nov", "Dec"
							];

							function P(t, e) {
								return Object.prototype.hasOwnProperty.call(t, e)
							}
							I.log = function() {
								console.log("%s - %s",
									function n() {
										var t = new Date,
											e = [l(t.getHours()), l(t.getMinutes()), l(t
												.getSeconds())].join(":");
										return [t.getDate(), p[t.getMonth()], e].join(
											" ")
									}(), I.format.apply(I, arguments))
							}, I.inherits = A(66), I._extend = function(t, e) {
								if (!e || !f(e)) return t;
								for (var n = Object.keys(e), r = n.length; r--;) t[n[r]] =
									e[n[r]];
								return t
							};
							var n = "undefined" != typeof Symbol ? Symbol(
								"util.promisify.custom") : undefined;

							function d(t, e) {
								if (!t) {
									var n = new Error(
									"Promise was rejected with a falsy value");
									n.reason = t, t = n
								}
								return e(t)
							}
							I.promisify =
								function(u) {
									if ("function" != typeof u) throw new TypeError(
										'The "original" argument must be of type Function'
										);
									if (n && u[n]) {
										var t;
										if ("function" != typeof(t = u[n])) throw new TypeError(
											'The "util.promisify.custom" argument must be of type Function'
											);
										return Object.defineProperty(t, n, {
											value: t,
											enumerable: !1,
											writable: !1,
											configurable: !0
										}), t
									}

									function t() {
										for (var n, r, t = new Promise(function(t, e) {
												n = t, r = e
											}), e = [], o = 0; o < arguments.length; o++) e
											.push(arguments[o]);
										e.push(function(t, e) {
											t ? r(t) : n(e)
										});
										try {
											u.apply(this, e)
										} catch (i) {
											r(i)
										}
										return t
									}
									return Object.setPrototypeOf(t, Object.getPrototypeOf(u)),
										n && Object.defineProperty(t, n, {
											value: t,
											enumerable: !1,
											writable: !1,
											configurable: !0
										}), Object.defineProperties(t, o(u))
								}, I.promisify.custom = n, I.callbackify = function C(i) {
									if ("function" != typeof i) throw new TypeError(
										'The "original" argument must be of type Function'
										);

									function t() {
										for (var t = [], e = 0; e < arguments.length; e++) t
											.push(arguments[e]);
										var n = t.pop();
										if ("function" != typeof n) throw new TypeError(
											"The last argument must be of type Function"
											);

										function r() {
											return n.apply(o,
												arguments)
										}
										var o = this;
										i.apply(this, t).then(function(t) {
											u.nextTick(r, null, t)
										}, function(t) {
											u.nextTick(d, t, r)
										})
									}
									return Object.setPrototypeOf(t, Object.getPrototypeOf(i)),
										Object.defineProperties(t, o(i)), t
								}
						}).call(this, A(68))
					},
					function(t, e, n) {
						e.__esModule = !0;
						var a = o(n(16)),
							r = o(n(28));
						e.supportBeacon = l, e.post = function i(c) {
							return new r["default"](function(t, e) {
								if (l()) {
									var n = c.url,
										r = c.data,
										o = c.processData;
									if ((0, s.isPlainObject)(r))
										if (o) {
											var i = new FormData,
												u = [];
											(0, f.prepareFormData)(u, r), u.forEach(
												function(t) {
													var e =
														t[0],
														n = t[1];
													i.append(e, n)
												}), r = i
										} else r = (0, a["default"])(r);
									navigator.sendBeacon(n, r) ? t({
										result: 1,
										msg: "\u8fdb\u5165\u4e86\u53d1\u9001\u961f\u5217\uff0c\u6d4f\u89c8\u5668\u4f1a\u5c3d\u529b\u4fdd\u8bc1\u53d1\u9001\u6210\u529f",
										type: "beacon"
									}) : e({
										error: "\u961f\u5217\u603b\u6570\u3001\u6570\u636e\u5927\u5c0f\u7684\u9650\u5236!"
									})
								}
							})
						};
						var s = n(6),
							f = n(45);

						function o(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}

						function l() {
							return !!navigator.sendBeacon
						}
					},
					function(t, e, n) {
						var o = n(4),
							i = n(0),
							u = n(13);
						t.exports = function(t,
							e) {
							var n = (i.Object || {})[t] || Object[t],
								r = {};
							r[t] = e(n), o(o.S + o.F * u(function() {
								n(1)
							}), "Object", r)
						}
					},
					function(t, e, n) {
						var r = n(34),
							o = n(19);
						n(71)("keys", function() {
							return function(t) {
								return o(r(t))
							}
						})
					},
					function(t, e, n) {
						n(72), t.exports = n(0).Object.keys
					},
					function(t, e, n) {
						e.__esModule = !0;
						var o = u(n(16)),
							r = u(n(28)),
							_ = u(n(11));
						e.serializeData = T, e.ajax = c, e.get = function a(t) {
							c(t)
						}, e.post = function s(t) {
							return new r["default"](function(e, r) {
								c((0, _["default"])(t, {
									type: "POST",
									contentType: "text/plain;charset=UTF-8",
									data: (0,
										o["default"])(t.data),
									error: function(t, e, n) {
										r({
											error: "request timeout"
										})
									},
									success: function(t) {
										e(t)
									}
								}))
							})
						};
						var i = n(6),
							g = n(45);

						function u(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						var b = document.createElement("a"),
							w = "application/json",
							x = "text/html",
							O = {
								script: "text/javascript, application/javascript, application/x-javascript",
								json: w,
								xml: "application/xml, text/xml",
								html: x,
								text: "text/plain"
							},
							S = /^(?:text|application)\/javascript/i,
							E = /^(?:text|application)\/xml/i,
							j = /^\s*$/;

						function T(t) {
							t.processData && (t.data &&
								(!(0, i.isString)(t.data) && (t.data = (0, g.param)(t.data, t
									.traditional)))), !t.data || (t.type && ("GET" != t.type
								.toUpperCase() && "jsonp" != t.dataType) || (t.url = (0, g
								.appendQuery)(t.url, t.data), t.data = undefined))
						}

						function M() {}

						function P(t, e, n, r) {
							r.error && r.error.call(null, n, e, t), R(e, n, r)
						}

						function R(t, e, n) {
							n.complete && n.complete.call(null, e, t)
						}

						function c(t) {
							var e, i = (0, _["default"])({
									type: "GET",
									processData: !0,
									async: !0,
									crossDomain: !1
								}, t),
								n = void 0;
							i.crossDomain || ((n = document.createElement("a")).href = i.url, n
								.href =
								n.href, i.crossDomain = b.protocol + "//" + b.host != n
								.protocol + "//" + n.host), i.url || (i.url = window.location
								.toString()), -1 < (e = i.url.indexOf("#")) && (i.url = i.url
								.slice(0, e)), T(i);
							var u = i.dataType;
							!1 === i.cache && (i.url = (0, g.appendQuery)(i.url, "_=" + Date
						.now()));
							var r = O[u],
								c = void 0,
								o = {},
								a = function a(t, e) {
									t && (o[t.toLocaleLowerCase()] = [t, e])
								},
								s = /^([\w-]+:)\/\//.test(i.url) ? RegExp.$1 : window.location
								.protocol,
								f = window.XDomainRequest ? function y() {
									try {
										return new window.XDomainRequest
									} catch (t) {}
								}() : function m() {
									try {
										return new window.XMLHttpRequest
									} catch (t) {}
								}(),
								l = f.setRequestHeader;
							if (i.crossDomain || a("X-Requested-With", "XMLHttpRequest"), a(
									"Accept", r || "*/*"), (r = i.mimeType || r) && (-1 < r.indexOf(
										",") && (r = r.split(",", 2)[0]), f.overrideMimeType && f
									.overrideMimeType(r)), (i.contentType || !1 !== i.contentType &&
									(i.data && "GET" != i.type.toUpperCase())) && a("Content-Type",
									i.contentType || "application/x-www-form-urlencoded"), i
								.headers)
								for (var p in i.headers) a(p, o[p]);
							f.setRequestHeader = a, f.onreadystatechange = function() {
								if (4 == f.readyState) {
									f.onreadystatechange = M, clearTimeout(c);
									var t = void 0,
										e = !1;
									if (200 <= f.status && f.status < 300 || (304 == f.status ||
											(0 == f.status || 0 == f.status && "file:" == s))) {
										if (u = u || function n(t) {
												return (t = t && t.split(";", 2)[0]) && (t ==
														x ? "html" : t == w ? "json" : S.test(
														t) ? "script" : E.test(t) && "xml") ||
													"text"
											}(i.mimeType || f.getResponseHeader(
											"content-type")), "arraybuffer" == f.responseType ||
											"blob" == f.responseType) t = f.response;
										else {
											t = f.responseText;
											try {
												"xml" == u ? t = f.responseXML : "json" == u &&
													(t = j.test(t) ? null : JSON.parse(t))
											} catch (r) {
												e = r
											}
											if (e) return P(e, "parsererror", f, i)
										}(function o(t,
											e, n) {
											var r = "success";
											n.success && n.success.call(null, t, r, e), R(r,
												e, n)
										})(t = t || {
											result: 1,
											type: "ajax"
										}, f, i)
									} else P(f.statusText || null, f.status ? "error" : "abort",
										f, i)
								}
							};
							var d = !!i.async;
							if (f.open(i.type, i.url, d), i.xhrFields)
								for (var h in i.xhrFields) f[h] = i.xhrFields[h];
							if (l)
								for (var v in o) l.apply(f, o[v]);
							0 < i.timeout && (c = setTimeout(function() {
								f.onreadystatechange = M, f.abort(), P(null, "timeout",
									f, i)
							}, i.timeout)), f.send(i.data ? i.data : null)
						}
					},
					function(t, e, n) {
						var r = n(4),
							o = n(27),
							i = n(47);
						r(r.S, "Promise", {
							"try": function(t) {
								var e =
									o.f(this),
									n = i(t);
								return (n.e ? e.reject : e.resolve)(n.v), e.promise
							}
						})
					},
					function(t, e, n) {
						var r = n(4),
							o = n(0),
							i = n(1),
							u = n(49),
							c = n(46);
						r(r.P + r.R, "Promise", {
							"finally": function(e) {
								var n = u(this, o.Promise || i.Promise),
									t = "function" == typeof e;
								return this.then(t ? function(t) {
									return c(n, e()).then(function() {
										return t
									})
								} : e, t ? function(t) {
									return c(n, e()).then(function() {
										throw t;
									})
								} : e)
							}
						})
					},
					function(t, e, n) {
						var i = n(2)("iterator"),
							u = !1;
						try {
							var r = [7][i]();
							r["return"] = function() {
								u = !0
							}, Array.from(r, function() {
								throw 2;
							})
						} catch (c) {}
						t.exports =
							function(t, e) {
								if (!e && !u) return !1;
								var n = !1;
								try {
									var r = [7],
										o = r[i]();
									o.next = function() {
										return {
											done: n = !0
										}
									}, r[i] = function() {
										return o
									}, t(r)
								} catch (c) {}
								return n
							}
					},
					function(t, e, n) {
						var r = n(1),
							o = n(0),
							i = n(9),
							u = n(8),
							c = n(2)("species");
						t.exports = function(t) {
							var e = "function" == typeof o[t] ? o[t] : r[t];
							u && (e && (!e[c] && i.f(e, c, {
								configurable: !0,
								get: function() {
									return this
								}
							})))
						}
					},
					function(t, e, n) {
						var o = n(10);
						t.exports = function(t, e, n) {
							for (var r in e) n && t[r] ? t[r] = e[r] : o(t, r, e[r]);
							return t
						}
					},
					function(t, e, n) {
						var r = n(1).navigator;
						t.exports = r && r.userAgent || ""
					},
					function(t, e, n) {
						var c = n(1),
							a = n(48).set,
							s = c.MutationObserver || c.WebKitMutationObserver,
							f = c.process,
							l = c.Promise,
							p = "process" == n(18)(f);
						t.exports = function() {
							function t() {
								var t, e;
								for (p && ((t = f.domain) && t.exit()); r;) {
									e = r.fn, r = r.next;
									try {
										e()
									} catch (n) {
										throw r ? i() : o = undefined, n;
									}
								}
								o = undefined, t && t.enter()
							}
							var r, o, i;
							if (p) i = function() {
								f.nextTick(t)
							};
							else if (!s || c.navigator && c.navigator.standalone)
								if (l && l.resolve) {
									var e = l.resolve(undefined);
									i = function() {
										e.then(t)
									}
								} else i = function() {
									a.call(c,
										t)
								};
							else {
								var n = !0,
									u = document.createTextNode("");
								(new s(t)).observe(u, {
									characterData: !0
								}), i = function() {
									u.data = n = !n
								}
							}
							return function(t) {
								var e = {
									fn: t,
									next: undefined
								};
								o && (o.next = e), r || (r = e, i()), o = e
							}
						}
					},
					function(t, e) {
						t.exports = function(t, e, n) {
							var r = n === undefined;
							switch (e.length) {
								case 0:
									return r ? t() : t.call(n);
								case 1:
									return r ? t(e[0]) : t.call(n, e[0]);
								case 2:
									return r ? t(e[0], e[1]) : t.call(n, e[0], e[1]);
								case 3:
									return r ? t(e[0], e[1], e[2]) : t.call(n, e[0], e[1], e[
									2]);
								case 4:
									return r ? t(e[0], e[1], e[2], e[3]) : t.call(n, e[0],
										e[1], e[2], e[3])
							}
							return t.apply(n, e)
						}
					},
					function(t, e, n) {
						var r = n(50),
							o = n(2)("iterator"),
							i = n(15);
						t.exports = n(0).getIteratorMethod = function(t) {
							if (t != undefined) return t[o] || (t["@@iterator"] || i[r(t)])
						}
					},
					function(t, e, n) {
						var r = n(15),
							o = n(2)("iterator"),
							i = Array.prototype;
						t.exports = function(t) {
							return t !== undefined && (r.Array === t || i[o] === t)
						}
					},
					function(t, e, n) {
						var u = n(3);
						t.exports = function(t, e, n, r) {
							try {
								return r ? e(u(n)[0], n[1]) : e(n)
							} catch (i) {
								var o = t["return"];
								throw o !== undefined && u(o.call(t)), i;
							}
						}
					},
					function(t, e, n) {
						var p =
							n(20),
							d = n(85),
							h = n(84),
							v = n(3),
							y = n(60),
							m = n(83),
							_ = {},
							g = {};
						(e = t.exports = function(t, e, n, r, o) {
							var i, u, c, a, s = o ? function() {
									return t
								} : m(t),
								f = p(n, r, e ? 2 : 1),
								l = 0;
							if ("function" != typeof s) throw TypeError(t +
							" is not iterable!");
							if (h(s))
								for (i = y(t.length); l < i; l++) {
									if ((a = e ? f(v(u = t[l])[0], u[1]) : f(t[l])) === _ ||
										a === g) return a
								} else
									for (c = s.call(t); !(u = c.next()).done;)
										if ((a = d(c, f, u.value, e)) === _ || a === g) return a
						}).BREAK = _, e.RETURN = g
					},
					function(t, e) {
						t.exports = function(t, e, n, r) {
							if (!(t instanceof e) || r !== undefined && r in t) throw TypeError(
								n +
								": incorrect invocation!");
							return t
						}
					},
					function(t, e, r) {
						function o() {}

						function p(t) {
							var e;
							return !(!y(t) || "function" != typeof(e = t.then)) && e
						}

						function i(l, n) {
							if (!l._n) {
								l._n = !0;
								var r = l._c;
								x(function() {
									for (var s = l._v, f = 1 == l._s, t = 0, e = function(
										t) {
											var e, n, r, o = f ? t.ok : t.fail,
												i = t.resolve,
												u = t.reject,
												c = t.domain;
											try {
												o ? (f || (2 == l._h && F(l), l._h = 1),
													!0 === o ? e = s : (c && c
														.enter(), e = o(s), c && (c
															.exit(), r = !0)), e ===
													t.promise ? u(M(
														"Promise-chain cycle")) : (
														n = p(e)) ? n.call(e, i,
													u) : i(e)) : u(s)
											} catch (a) {
												c && (!r && c.exit()), u(a)
											}
										}; r.length >
										t;) e(r[t++]);
									l._c = [], l._n = !1, n && (!l._h && L(l))
								})
							}
						}

						function u(t) {
							var e = this;
							e._d || (e._d = !0, (e = e._w || e)._v = t, e._s = 2, e._a || (e._a = e
								._c.slice()), i(e, !0))
						}
						var n, c, a, s, f = r(17),
							l = r(1),
							d = r(20),
							h = r(50),
							v = r(4),
							y = r(5),
							m = r(26),
							_ = r(87),
							g = r(86),
							b = r(49),
							w = r(48).set,
							x = r(81)(),
							O = r(27),
							S = r(47),
							E = r(80),
							j = r(46),
							T = "Promise",
							M = l.TypeError,
							P = l.process,
							R = P && P.versions,
							C = R && R.v8 || "",
							I = l[T],
							A = "process" == h(P),
							k = c = O.f,
							D = !! function() {
								try {
									var t = I.resolve(1),
										e = (t.constructor = {})[r(2)("species")] = function(t) {
											t(o, o)
										};
									return (A || "function" ==
										typeof PromiseRejectionEvent) && (t.then(
										o) instanceof e && (0 !== C.indexOf("6.6") && -1 === E
											.indexOf("Chrome/66")))
								} catch (n) {}
							}(),
							L = function(i) {
								w.call(l, function() {
									var t, e, n, r = i._v,
										o = N(i);
									if (o && (t = S(function() {
											A ? P.emit("unhandledRejection", r, i) :
												(e = l.onunhandledrejection) ? e({
													promise: i,
													reason: r
												}) : (n = l.console) && (n.error &&
													n.error(
														"Unhandled promise rejection",
														r))
										}), i._h = A || N(i) ? 2 : 1), i._a = undefined,
										o && t.e) throw t.v;
								})
							},
							N = function(t) {
								return 1 !== t._h && 0 === (t._a || t._c).length
							},
							F = function(e) {
								w.call(l, function() {
									var t;
									A ? P.emit("rejectionHandled", e) : (t = l
										.onrejectionhandled) && t({
										promise: e,
										reason: e._v
									})
								})
							},
							U = function(n) {
								var r, o = this;
								if (!o._d) {
									o._d = !0, o = o._w || o;
									try {
										if (o === n) throw M("Promise can't be resolved itself");
										(r = p(n)) ? x(function() {
											var t = {
												_w: o,
												_d: !1
											};
											try {
												r.call(n, d(U, t, 1), d(u, t, 1))
											} catch (e) {
												u.call(t, e)
											}
										}): (o._v = n, o._s = 1, i(o, !1))
									} catch (t) {
										u.call({
											_w: o,
											_d: !1
										}, t)
									}
								}
							};
						D || (I = function(t) {
							_(this, I, T, "_h"), m(t), n.call(this);
							try {
								t(d(U, this, 1), d(u, this, 1))
							} catch (e) {
								u.call(this, e)
							}
						}, (n = function(t) {
							this._c = [], this._a = undefined,
								this._s = 0, this._d = !1, this._v = undefined, this
								._h = 0, this._n = !1
						}).prototype = r(79)(I.prototype, {
							then: function(t, e) {
								var n = k(b(this, I));
								return n.ok = "function" != typeof t || t, n.fail =
									"function" == typeof e && e, n.domain = A ? P
									.domain : undefined, this._c.push(n), this._a &&
									this._a.push(n), this._s && i(this, !1), n
									.promise
							},
							"catch": function(t) {
								return this.then(undefined, t)
							}
						}), a = function() {
							var t = new n;
							this.promise = t, this.resolve = d(U, t, 1), this.reject = d(u,
								t, 1)
						}, O.f = k = function(t) {
							return t === I || t === s ? new a(t) : c(t)
						}), v(v.G + v.W + v.F *
							!D, {
								Promise: I
							}), r(22)(I, T), r(78)(T), s = r(0)[T], v(v.S + v.F * !D, T, {
							reject: function(t) {
								var e = k(this);
								return (0, e.reject)(t), e.promise
							}
						}), v(v.S + v.F * (f || !D), T, {
							resolve: function(t) {
								return j(f && this === s ? I : this, t)
							}
						}), v(v.S + v.F * !(D && r(77)(function(t) {
							I.all(t)["catch"](o)
						})), T, {
							all: function(t) {
								var u = this,
									e = k(u),
									c = e.resolve,
									a = e.reject,
									n = S(function() {
										var r = [],
											o = 0,
											i = 1;
										g(t, !1, function(t) {
											var e = o++,
												n = !1;
											r.push(undefined), i++, u
												.resolve(t).then(function(
												t) {
													n || (n = !0, r[e] =
														t, --i || c(
															r))
												}, a)
										}), --i || c(r)
									});
								return n.e && a(n.v),
									e.promise
							},
							race: function(t) {
								var e = this,
									n = k(e),
									r = n.reject,
									o = S(function() {
										g(t, !1, function(t) {
											e.resolve(t).then(n.resolve, r)
										})
									});
								return o.e && r(o.v), n.promise
							}
						})
					},
					function(t, e, n) {
						n(52), n(59), n(55), n(88), n(76), n(75), t.exports = n(0).Promise
					},
					function(t, e, n) {
						e.__esModule = !0;
						var r = s(n(28)),
							o = s(n(11)),
							i = s(n(14)),
							u = n(74),
							c = n(70),
							a = n(29);
						n(69);

						function s(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						var f = (0, c.supportBeacon)() ? c.post : u.post,
							l = (p.prototype._schedule = function() {
								var t = this;
								t._status = 1, t._timer || (1 !==
									t._status || (t._timer = setTimeout(function() {
										t.flush(), t._timer = null
									}, t._batchDelay)))
							}, p.prototype.start = function() {
								this._status = 1, this._schedule()
							}, p.prototype.stop = function() {
								this._status = 2;
								var t = this._timer;
								t && (clearTimeout(t), this._timer = null)
							}, p.prototype._shouldSend = function(i) {
								var u = this;
								return new r["default"](function(t) {
									var e = u,
										n = i.type,
										r = i.data,
										o = i.apiUrl;
									switch (e._commonInfo = r, e.apiUrl = o, n) {
										case a.MIDDLEWARE_TYPE_COMMON_INFO:
											e._commonInfo = r;
											break;
										default:
											t()
									}
								})
							}, p.prototype.queue = function(e) {
								var n =
									this;
								n._shouldSend(e).then(function(t) {
									n._queue.push(e), n._schedule()
								})
							}, p.prototype.send = function(e) {
								var t = this;
								return t._shouldSend(e).then(function() {
									return f({
										url: t.apiUrl || t._url,
										data: t._commonInfo
									})
								}).then(function(t) {
									e.success && e.success(t)
								})["catch"](function(t) {
									e.fail && e.fail(res)
								})
							}, p.prototype.flush = function() {
								var t = this;
								console.log("flush"), 0 < t._queue.length && (console.log(
									"flush"), f({
									url: t.apiUrl || t._url,
									data: t._commonInfo
								}), t._queue = [])
							}, p);

						function p(t) {
							(0, i["default"])(this, p);
							this._queue = [], this._batchDelay = 2;
							var e = (0, o["default"])({
									senderBatchDelay: 200
								}, t),
								n = e.senderBatchDelay,
								r = e.senderUrl;
							this._batchDelay = n, this._url = r
						}
						e["default"] = l
					},
					function(t, e, n) {
						var r;
						t.exports = (r = {}, (r = function() {
							this.listeners = {}
						}).prototype = {
							addEventListener: function(t, e, n) {
								for (var r = [], o = arguments.length, i = 0; i <
									o; i++) r.push(arguments[i]);
								r = 3 < r.length ? r.splice(3, r.length - 1) : [],
									"undefined" != typeof this.listeners[t] ? this
									.listeners[t].push({
										scope: n,
										callback: e,
										args: r
									}) : this.listeners[t] = [{
										scope: n,
										callback: e,
										args: r
									}]
							},
							removeEventListener: function(t, e, n) {
								if ("undefined" != typeof this.listeners[t]) {
									for (var r = this.listeners[t].length, o = [], i =
										0; i < r; i++) {
										var u = this.listeners[t][i];
										u.scope == n && u.callback == e || o.push(u)
									}
									this.listeners[t] = o
								}
							},
							hasEventListener: function(t, e, n) {
								if ("undefined" != typeof this.listeners[t]) {
									var r = this.listeners[t].length;
									if (e === undefined && n === undefined) return 0 <
									r;
									for (var o = 0; o < r; o++) {
										var i = this.listeners[t][o];
										if ((!n || i.scope == n) && i.callback == e)
											return !0
									}
								}
								return !1
							},
							dispatch: function(t, e) {
								for (var n = {
										type: t,
										target: e
									}, r = [], o = arguments.length, i = 0; i < o; i++)
									r.push(arguments[i]);
								if (r = 2 < r.length ? r.splice(2, r.length - 1) : [],
									r = [n].concat(r), "undefined" != typeof this
									.listeners[t]) {
									var u = this.listeners[t].slice(),
										c = u.length;
									for (i = 0; i < c; i++) {
										var a = u[i];
										if (a && a.callback) {
											var s = r.concat(a.args);
											a.callback.apply(a.scope, s)
										}
									}
								}
							},
							getEvents: function() {
								var t = "";
								for (var e in this.listeners)
									for (var n = this.listeners[e].length, r = 0; r <
										n; r++) {
										var o = this.listeners[e][r];
										t += o.scope && o.scope.className ? o.scope
											.className : "anonymous",
											t += " listen for '" + e + "'\n"
									}
								return t
							}
						}, new r)
					},
					function(t, e, n) {
						e.__esModule = !0;
						var r = function o(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}(n(91));
						e["default"] = r["default"]
					},
					function(t, e, n) {
						e.__esModule = !0;
						var u = r(n(11)),
							c = r(n(14)),
							a = r(n(92));

						function r(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						var o = (s.prototype._pushMWHook = function(t, e) {
								e[t] && this._middleware[t].push(e[t].bind(e))
							}, s.prototype.destroy = function() {
								this._middleware.destroy.forEach(function(t) {
									return t()
								})
							}, s.prototype.start = function() {
								this._sender.start()
							},
							s.prototype.stop = function() {
								this._sender.stop()
							}, s.prototype._pipe = function(t) {
								for (var e = t, n = this._middleware.pipe, r = n.length, o =
									0; o < r && !1 !== (e = n[o](t)); o++);
								return e
							}, s.prototype.queue = function(t) {
								!1 !== (t = this._pipe(t)) && this._sender.queue(t)
							}, s.prototype.send = function(t) {
								!1 !== (t = this._pipe(t)) && this._sender.send(t)
							}, s.prototype.flush = function() {
								this._sender.flush()
							}, s);

						function s(t) {
							(0, c["default"])(this, s);
							var n = this;
							this._middleware = {
									destroy: [],
									pipe: []
								}, this._sender = null, this.hasBeforeSenderFunction = !1, this
								.beforeSendFn = function() {}, this.bus = null;
							var r = (0, u["default"])({
									middleware: []
								}, t),
								e = r.middleware,
								o = r.sender,
								i = (r.active, a["default"]);
							n._sender = o, n.bus = i, n.beforeSend = function(t) {
								this.hasBeforeSenderFunction = !0, this.beforeSendFn = t
							}, e.forEach(function(e) {
								e.create && e.create({
									options: r,
									bus: i,
									stat: n
								}), ["pipe", "destroy"].forEach(function(t) {
									return n._pushMWHook(t, e)
								})
							})
						}
						e["default"] = o
					},
					function(t, e, n) {
						var r = n(4);
						r(r.S, "Object", {
							create: n(32)
						})
					},
					function(t, e, n) {
						n(94);
						var r = n(0).Object;
						t.exports =
							function(t, e) {
								return r.create(t, e)
							}
					},
					function(t, e, n) {
						t.exports = {
							"default": n(95),
							__esModule: !0
						}
					},
					function(t, e, o) {
						function i(t, e) {
							if (r(t), !n(e) && null !== e) throw TypeError(e +
								": can't set as prototype!");
						}
						var n = o(5),
							r = o(3);
						t.exports = {
							set: Object.setPrototypeOf || ("__proto__" in {} ? function(t, n,
							r) {
								try {
									(r = o(20)(Function.call, o(53).f(Object.prototype,
										"__proto__").set, 2))(t, []), n = !(
										t instanceof Array)
								} catch (e) {
									n = !0
								}
								return function(t, e) {
									return i(t, e), n ? t.__proto__ = e : r(t, e), t
								}
							}({}, !1) : undefined),
							check: i
						}
					},
					function(t,
						e, n) {
						var r = n(4);
						r(r.S, "Object", {
							setPrototypeOf: n(97).set
						})
					},
					function(t, e, n) {
						n(98), t.exports = n(0).Object.setPrototypeOf
					},
					function(t, e, n) {
						t.exports = {
							"default": n(99),
							__esModule: !0
						}
					},
					function(t, e, n) {
						e.__esModule = !0;
						var r = u(n(100)),
							o = u(n(96)),
							i = u(n(33));

						function u(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						e["default"] = function(t, e) {
							if ("function" != typeof e && null !== e) throw new TypeError(
								"Super expression must either be null or a function, not " +
								(void 0 === e ? "undefined" : (0, i["default"])(e)));
							t.prototype = (0,
								o["default"])(e && e.prototype, {
								constructor: {
									value: t,
									enumerable: !1,
									writable: !0,
									configurable: !0
								}
							}), e && (r["default"] ? (0, r["default"])(t, e) : t.__proto__ =
								e)
						}
					},
					function(t, e, n) {
						e.__esModule = !0;
						var r = function o(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}(n(33));
						e["default"] = function(t, e) {
							if (!t) throw new ReferenceError(
								"this hasn't been initialised - super() hasn't been called"
								);
							return !e || "object" !== (void 0 === e ? "undefined" : (0, r[
								"default"])(e)) && "function" != typeof e ? t : e
						}
					},
					function(t, e, n) {
						e.__esModule = !0;
						var r =
							s(n(11)),
							o = s(n(14)),
							i = s(n(102)),
							u = s(n(101)),
							c = s(n(93)),
							a = s(n(90));

						function s(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						var f, l = (f = c["default"], (0, u["default"])(p, f), p);

						function p(t) {
							return (0, o["default"])(this, p), (0, i["default"])(this, f.call(this,
								(0, r["default"])({
									sender: new a["default"](t),
									middleware: []
								}, t)))
						}
						e["default"] = l
					},
					function(t, e, n) {
						e.__esModule = !0;
						var d = i(n(16)),
							h = i(n(11)),
							r = i(n(14)),
							v = n(6),
							o = n(51),
							y = i(n(21)),
							m = n(29);

						function i(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						var u = (c.prototype.create =
							function(t) {
								var a = this,
									e = t.stat;
								this.stat = e, this.activityData = null, this.opts = t;
								var n = (0, h["default"])({
										activityUse: !0,
										activityManualCollect: !1
									}, t.options),
									r = n.activityUse,
									o = n.activityManualCollect;
								if (a.activityUse = r, a.activityManualCollect = o, e.report)
									throw Error(
										"has the same function in other middlewave\uff01");
								if (e.report = this._actSend.bind(this), r) {
									var i = function i() {
											var c = function c(t) {
												var e = t.target || t.srcElement,
													n = m.TRACKER_TAG.ET_TAP,
													r = e.getAttribute(n);
												if ((e = r ? e : (0, v.closest)(e, n)) && (
														r = r ||
														(0, v.closest)(e, n) && (0, v
															.closest)(e, n).getAttribute(n)
														)) {
													var o = e.getAttribute(m.TRACKER_TAG
															.OPTIONS),
														i = {};
													if (o) try {
														i = (0, v.json2Object)(o)
													} catch (u) {
														throw Error(u);
													}
													i = (0, h["default"])({}, i, {
														activity_type: "tap"
													}, {
														activity_id: r
													}), a._actSend(i)
												}
											};
											(0, v.addEvent)(document.body, "click", c)
										},
										u = function u() {
											(0, v.isFunction)(o) ? o({
												bindEvent: i
											}): setTimeout(i, 10)
										};
									"complete" === document.readyState ? u() : (0, v.addEvent)(
										window, "load", u)
								}
							}, c.prototype._beforeSend = function(t, e) {
								var n = this.stat,
									r = t;
								return n.hasBeforeSenderFunction &&
									(r = n.beforeSendFn(t)), r = (0, o.handleCommonData)(r, e)
							}, c.prototype._actSend = function(t, c) {
								var e = this.opts,
									n = this,
									a = this.stat,
									s = t.activity_type,
									f = m.TRACKER_SERVER.ACTIVITY,
									l = void 0,
									r = this._beforeSend(t, s);
								if (r.switcher && ("expose" === s ? (f = m.TRACKER_SERVER
											.IMPRESSION, l = (0, h["default"])({}, e.options
												.data, t), r.activity_commmon && (l = (0, h[
												"default"])({}, {
												activity_commmon: r.activity_commmon
											}, l))) : l = (0, h["default"])({}, e.options.data,
											r), l.activity_commmon && (l.activity_commmon =
											encodeURIComponent((0, v.json2String)(l
												.activity_commmon))),
										l.activity_data && (l.activity_data =
											encodeURIComponent((0, v.json2String)(l
												.activity_data))), l.activity_ext && (l
											.activity_ext = encodeURIComponent((0, v
												.json2String)(l.activity_ext))), l.ext_info && (
											(0, v.isObject)(l.ext_info) && (l.ext_info =
												encodeURIComponent((0, v.json2String)(l
													.ext_info)))), (0, h["default"])(e
										.options, {
											senderUrl: f
										}), n.activityUse)) {
									var o = window,
										i = document,
										p = function p() {
											var t = (0, v.setSessionNo)();
											if (a.send({
													type: m.MIDDLEWARE_TYPE_ACT,
													data: (0, h["default"])({}, l, {
														session_no: t
													}),
													apiUrl: f,
													success: function(t) {
														c &&
															c(t)
													}
												}), "expose" !== s) {
												var e = (0, h["default"])({}, l, {
														session_no: t
													}),
													n = e.activity_data,
													r = e.activity_ext,
													o = e.activity_id,
													i = e.activity_type,
													u = (0, d["default"])({
														activity_data: n,
														activity_ext: r,
														activity_id: o,
														activity_type: i
													});
												y["default"].set("vip_tracker_source_from", u)
											}
										},
										u = function u() {
											(0, v.isFunction)(n.activityManualCollect) ? n
												.activityManualCollect({
													doCollect: p
												}): setTimeout(p, 10)
										};
									"complete" === i.readyState ? u() : (0, v.addEvent)(o,
										"load", u)
								}
							}, c.prototype.destroy = function() {
								console.warn("destroy", opts), document.body
									.removeEventListener("click",
										bindClick, !1)
							}, c);

						function c() {
							(0, r["default"])(this, c)
						}
						e["default"] = u
					},
					function(t, e, n) {
						n(30)("observable")
					},
					function(t, e, n) {
						n(30)("asyncIterator")
					},
					function(t, e, n) {
						var r = n(12),
							o = n(54).f,
							i = {}.toString,
							u = "object" == typeof window && (window && Object
							.getOwnPropertyNames) ? Object.getOwnPropertyNames(window) : [];
						t.exports.f = function(t) {
							return u && "[object Window]" == i.call(t) ? function(t) {
								try {
									return o(t)
								} catch (e) {
									return u.slice()
								}
							}(t) : o(r(t))
						}
					},
					function(t, e, n) {
						var r = n(18);
						t.exports = Array.isArray || function(t) {
							return "Array" ==
								r(t)
						}
					},
					function(t, e, n) {
						var c = n(19),
							a = n(35),
							s = n(23);
						t.exports = function(t) {
							var e = c(t),
								n = a.f;
							if (n)
								for (var r, o = n(t), i = s.f, u = 0; o.length > u;) i.call(t,
									r = o[u++]) && e.push(r);
							return e
						}
					},
					function(t, e, n) {
						function r(t) {
							c(t, o, {
								value: {
									i: "O" + ++a,
									w: {}
								}
							})
						}
						var o = n(24)("meta"),
							i = n(5),
							u = n(7),
							c = n(9).f,
							a = 0,
							s = Object.isExtensible || function() {
								return !0
							},
							f = !n(13)(function() {
								return s(Object.preventExtensions({}))
							}),
							l = t.exports = {
								KEY: o,
								NEED: !1,
								fastKey: function(t, e) {
									if (!i(t)) return "symbol" == typeof t ? t : ("string" ==
											typeof t ? "S" : "P") +
										t;
									if (!u(t, o)) {
										if (!s(t)) return "F";
										if (!e) return "E";
										r(t)
									}
									return t[o].i
								},
								getWeak: function(t, e) {
									if (!u(t, o)) {
										if (!s(t)) return !0;
										if (!e) return !1;
										r(t)
									}
									return t[o].w
								},
								onFreeze: function(t) {
									return f && (l.NEED && (s(t) && (!u(t, o) && r(t)))), t
								}
							}
					},
					function(t, e, n) {
						function r(t) {
							var e = H[t] = P(N[z]);
							return e._k = t, e
						}

						function o(t, e) {
							S(t);
							for (var n, r = x(e = j(e)), o = 0, i = r.length; o < i;) Z(t, n = r[
								o++], e[n]);
							return t
						}

						function i(t) {
							var e = V.call(this, t = T(t, !0));
							return !(this === J && (f(H, t) && !f(q, t))) && (!(e || (!f(this, t) ||
								(!f(H, t) || f(this, G) &&
									this[G][t]))) || e)
						}

						function u(t, e) {
							if (t = j(t), e = T(e, !0), t !== J || (!f(H, e) || f(q, e))) {
								var n = k(t, e);
								return !n || (!f(H, e) || (f(t, G) && t[G][e] || (n.enumerable = !
									0))), n
							}
						}

						function c(t) {
							for (var e, n = L(j(t)), r = [], o = 0; n.length > o;) f(H, e = n[
								o++]) || (e == G || (e == h || r.push(e)));
							return r
						}

						function a(t) {
							for (var e, n = t === J, r = L(n ? q : j(t)), o = [], i = 0; r.length >
								i;) !f(H, e = r[i++]) || (n && !f(J, e) || o.push(H[e]));
							return o
						}
						var s = n(1),
							f = n(7),
							l = n(8),
							p = n(4),
							d = n(57),
							h = n(110).KEY,
							v = n(13),
							y = n(37),
							m = n(22),
							_ = n(24),
							g = n(2),
							b = n(31),
							w = n(30),
							x = n(109),
							O = n(108),
							S = n(3),
							E = n(5),
							j = n(12),
							T = n(41),
							M = n(25),
							P = n(32),
							R = n(107),
							C = n(53),
							I = n(9),
							A = n(19),
							k = C.f,
							D = I.f,
							L = R.f,
							N = s.Symbol,
							F = s.JSON,
							U = F && F.stringify,
							z = "prototype",
							G = g("_hidden"),
							B = g("toPrimitive"),
							V = {}.propertyIsEnumerable,
							W = y("symbol-registry"),
							H = y("symbols"),
							q = y("op-symbols"),
							J = Object[z],
							K = "function" == typeof N,
							Y = s.QObject,
							X = !Y || (!Y[z] || !Y[z].findChild),
							$ = l && v(function() {
								return 7 != P(D({}, "a", {
									get: function() {
										return D(this, "a", {
											value: 7
										}).a
									}
								})).a
							}) ? function(t, e, n) {
								var r = k(J, e);
								r && delete J[e], D(t, e, n), r && (t !== J && D(J,
									e, r))
							} : D,
							Q = K && "symbol" == typeof N.iterator ? function(t) {
								return "symbol" == typeof t
							} : function(t) {
								return t instanceof N
							},
							Z = function(t, e, n) {
								return t === J && Z(q, e, n), S(t), e = T(e, !0), S(n), f(H, e) ? (n
									.enumerable ? (f(t, G) && (t[G][e] && (t[G][e] = !1)), n =
										P(n, {
											enumerable: M(0, !1)
										})) : (f(t, G) || D(t, G, M(1, {})), t[G][e] = !0), $(t,
										e, n)) : D(t, e, n)
							};
						K || (d((N = function() {
								if (this instanceof N) throw TypeError(
									"Symbol is not a constructor!");
								var e = _(0 < arguments.length ? arguments[0] :
										undefined),
									n = function(t) {
										this === J && n.call(q, t), f(this, G) &&
											(f(this[G], e) && (this[G][e] = !1)), $(
												this, e, M(1, t))
									};
								return l && (X && $(J, e, {
									configurable: !0,
									set: n
								})), r(e)
							})[z], "toString", function() {
								return this._k
							}), C.f = u, I.f = Z, n(54).f = R.f = c, n(23).f = i, n(35).f = a,
							l && (!n(17) && d(J, "propertyIsEnumerable", i, !0)), b.f =
							function(t) {
								return r(g(t))
							}), p(p.G + p.W + p.F * !K, {
							Symbol: N
						});
						for (var tt =
								"hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables"
								.split(","), et = 0; tt.length > et;) g(tt[et++]);
						for (var nt = A(g.store), rt = 0; nt.length >
							rt;) w(nt[rt++]);
						p(p.S + p.F * !K, "Symbol", {
							"for": function(t) {
								return f(W, t += "") ? W[t] : W[t] = N(t)
							},
							keyFor: function(t) {
								if (!Q(t)) throw TypeError(t + " is not a symbol!");
								for (var e in W)
									if (W[e] === t) return e
							},
							useSetter: function() {
								X = !0
							},
							useSimple: function() {
								X = !1
							}
						}), p(p.S + p.F * !K, "Object", {
							create: function(t, e) {
								return e === undefined ? P(t) : o(P(t), e)
							},
							defineProperty: Z,
							defineProperties: o,
							getOwnPropertyDescriptor: u,
							getOwnPropertyNames: c,
							getOwnPropertySymbols: a
						}), F && p(p.S + p.F * (!K || v(function() {
							var t = N();
							return "[null]" != U([t]) ||
								("{}" != U({
									a: t
								}) || "{}" != U(Object(t)))
						})), "JSON", {
							stringify: function(t) {
								for (var e, n, r = [t], o = 1; o < arguments.length;) r
									.push(arguments[o++]);
								if (n = e = r[1], (E(e) || t !== undefined) && !Q(t))
									return O(e) || (e = function(t, e) {
										if ("function" == typeof n && (e = n
												.call(this, t, e)), !Q(e))
											return e
									}), r[1] = e, U.apply(F, r)
							}
						}), N[z][B] || n(10)(N[z], B, N[z].valueOf), m(N, "Symbol"), m(Math,
							"Math", !0), m(s.JSON, "JSON", !0)
					},
					function(t, e, n) {
						n(111), n(52), n(106), n(105), t.exports = n(0).Symbol
					},
					function(t, e, n) {
						t.exports = {
							"default": n(112),
							__esModule: !0
						}
					},
					function(t, e) {
						t.exports = function(t, e) {
							return {
								value: e,
								done: !!t
							}
						}
					},
					function(t, e) {
						t.exports = function() {}
					},
					function(t, e, n) {
						var r = n(115),
							o = n(114),
							i = n(15),
							u = n(12);
						t.exports = n(58)(Array, "Array", function(t, e) {
							this._t = u(t), this._i = 0, this._k = e
						}, function() {
							var t = this._t,
								e = this._k,
								n = this._i++;
							return !t || n >= t.length ? (this._t = undefined, o(1)) : o(0,
								"keys" == e ? n : "values" == e ? t[n] : [n, t[n]])
						}, "values"), i.Arguments = i.Array, r("keys"), r("values"), r(
							"entries")
					},
					function(t, e, n) {
						var r = n(7),
							o = n(34),
							i = n(38)("IE_PROTO"),
							u = Object.prototype;
						t.exports = Object.getPrototypeOf || function(t) {
							return t = o(t), r(t, i) ? t[i] : "function" == typeof t
								.constructor && t instanceof t.constructor ? t.constructor
								.prototype : t instanceof Object ? u : null
						}
					},
					function(t, e, n) {
						var u = n(9),
							c = n(3),
							a = n(19);
						t.exports = n(8) ? Object.defineProperties : function(t, e) {
							c(t);
							for (var n, r = a(e), o = r.length, i = 0; i < o;) u.f(t, n = r[
								i++], e[n]);
							return t
						}
					},
					function(t, e, n) {
						var r = n(32),
							o = n(25),
							i = n(22),
							u = {};
						n(10)(u, n(2)("iterator"), function() {
							return this
						}), t.exports = function(t, e, n) {
							t.prototype = r(u, {
								next: o(1,
									n)
							}), i(t, e + " Iterator")
						}
					},
					function(t, e, n) {
						var a = n(39),
							s = n(40);
						t.exports = function(c) {
							return function(t, e) {
								var n, r, o = String(s(t)),
									i = a(e),
									u = o.length;
								return i < 0 || u <= i ? c ? "" : undefined : (n = o
										.charCodeAt(i)) < 55296 || (56319 < n || (i + 1 ===
										u || ((r = o.charCodeAt(i + 1)) < 56320 ||
											57343 < r))) ? c ? o.charAt(i) : n : c ? o
									.slice(i, i + 2) : r - 56320 + (n - 55296 << 10) + 65536
							}
						}
					},
					function(t, e, n) {
						n(59), n(55), t.exports = n(31).f("iterator")
					},
					function(t, e, n) {
						t.exports = {
							"default": n(121),
							__esModule: !0
						}
					},
					function(t, e, n) {
						var r = n(0),
							o = r.JSON || (r.JSON = {
								stringify: JSON.stringify
							});
						t.exports = function(t) {
							return o.stringify.apply(o, arguments)
						}
					},
					function(t, e, n) {
						var r = n(39),
							o = Math.max,
							i = Math.min;
						t.exports = function(t, e) {
							return (t = r(t)) < 0 ? o(t + e, 0) : i(t, e)
						}
					},
					function(t, e, n) {
						var a = n(12),
							s = n(60),
							f = n(124);
						t.exports = function(c) {
							return function(t, e, n) {
								var r, o = a(t),
									i = s(o.length),
									u = f(n, i);
								if (c && e != e)
									for (; u < i;) {
										if ((r = o[u++]) != r) return !0
									} else
										for (; u < i; u++)
											if ((c || u in o) && o[u] === e) return c || (
												u || 0);
								return !c && -1
							}
						}
					},
					function(t, e, n) {
						var p = n(19),
							d = n(35),
							h = n(23),
							v = n(34),
							y = n(61),
							o = Object.assign;
						t.exports = !o || n(13)(function() {
							var t = {},
								e = {},
								n = Symbol(),
								r = "abcdefghijklmnopqrst";
							return t[n] = 7, r.split("").forEach(function(t) {
								e[t] = t
							}), 7 != o({}, t)[n] || Object.keys(o({}, e)).join("") != r
						}) ? function(t, e) {
							for (var n = v(t), r = arguments.length, o = 1, i = d.f, u = h
								.f; o < r;)
								for (var c, a = y(arguments[o++]), s = i ? p(a).concat(i(a)) :
										p(a), f = s.length, l = 0; l < f;) u.call(a, c = s[
									l++]) && (n[c] = a[c]);
							return n
						} : o
					},
					function(t, e, n) {
						var r = n(4);
						r(r.S + r.F, "Object", {
							assign: n(126)
						})
					},
					function(t, e, n) {
						n(127), t.exports = n(0).Object.assign
					},
					function(t, e, n) {
						e.__esModule = !0;
						var p = i(n(11)),
							r = i(n(14)),
							d = n(6),
							h = n(29),
							o = n(51),
							v = i(n(21));

						function i(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						var u = (c.prototype.create = function(t) {
								var e = t.stat;
								if (this.stat = e, this.opts = t, e.initPage) throw Error(
									"has the same function in other middlewave\uff01");
								e.initPage = this._pgReport.bind(this)
							}, c.prototype._pgReport = function(t) {
								var c = this,
									a = c.stat,
									e = (0, p["default"])({
										pageTtackerUse: !0,
										pageManualCollect: !1
									}, c.opts.options),
									n = e.pageTtackerUse,
									r = e.pageManualCollect,
									s = c._beforeSend({}, "page"),
									f = t && c._handleExtData(t);
								if (s.switcher && n) {
									var o = window,
										i = document,
										l = function l() {
											var t = c.opts.options.data,
												e = v["default"].get("vip_tracker_source_from"),
												n = {
													session_no: (0, d.setSessionNo)()
												},
												r = void 0,
												o = void 0;
											if (e) {
												var i = (0, d.json2Object)(e);
												r = i.activity_data || "", o = i.activity_ext ||
													"", r && (n.activity_data = (0, d
															.json2Object)(decodeURIComponent(
														r))), o && (n.activity_ext = (0, d
															.json2Object)(decodeURIComponent(
														o))), i.activity_type && (n
														.activity_type = i.activity_type), i
													.activity_id && (n.activity_id = i
														.activity_id)
											}
											s.ext_info &&
												((0, d.isObject)(s.ext_info) && (s.ext_info =
													encodeURIComponent((0, d.json2String)(s
														.ext_info))));
											var u = (0, p["default"])({}, t, s, n, f);
											u.activity_data && ((0, d.isObject)(u
													.activity_data) && (u.activity_data =
														encodeURIComponent((0, d.json2String)(u
															.activity_data)))), u
												.activity_ext && ((0, d.isObject)(u
													.activity_ext) && (u.activity_ext =
													encodeURIComponent((0, d.json2String)(u
														.activity_ext)))), a.send({
													type: h.MIDDLEWARE_TYPE_PAGE,
													data: u,
													apiUrl: h.TRACKER_SERVER.PAGE,
													success: function(t) {}
												}), v["default"].set("vip_tracker_source_from",
													"")
										},
										u = function u() {
											(0, d.isFunction)(r) ? r({
												doCollect: l
											}): setTimeout(l, 100)
										};
									"complete" === i.readyState ? u() : (0, d.addEvent)(o,
										"load", u)
								}
							}, c.prototype._handleExtData = function(t) {
								var e = (new Date).getTime(),
									n = {
										stream_id: e,
										timestamp: e
									};
								return t.page_url != undefined && (n.page_url =
										encodeURIComponent(t.page_url)), t.refer_url !=
									undefined && (n.refer_url = encodeURIComponent(t
									.refer_url)), n
							}, c.prototype._beforeSend = function(t, e) {
								var n = this.stat,
									r = t;
								return n.hasBeforeSenderFunction && (r = n.beforeSendFn(t)), r =
									(0, o.handleCommonData)(r)
							},
							c.prototype.destroy = function() {
								console.warn("destroy")
							}, c);

						function c() {
							(0, r["default"])(this, c)
						}
						e["default"] = u
					},
					function(t, e, n) {
						Array.prototype.forEach || (Array.prototype.forEach = function(t) {
							var e, n;
							if (null == this) throw new TypeError(
								"this is null or not defined");
							var r = Object(this),
								o = r.length >>> 0;
							if ("function" != typeof t) throw new TypeError(t +
								" is not a function");
							for (1 < arguments.length && (e = arguments[1]), n = 0; n <
								o;) {
								var i;
								n in r && (i = r[n], t.call(e, i, n, r)), n++
							}
						}), String.prototype.trim || (String.prototype.trim =
							function() {
								return this.replace(/(^\s*)|(\s*$)/g, "")
							}), Function.prototype.bind || (Function.prototype.bind = function(
							t) {
							if ("function" != typeof this) throw new TypeError(
								"Function.prototype.bind - what is trying to be bound is not callable"
								);
							var e = Array.prototype.slice.call(arguments, 1),
								n = this,
								r = function r() {},
								o = function o() {
									return n.apply(this instanceof r && t ? this : t, e
										.concat(Array.prototype.slice.call(arguments)))
								};
							return r.prototype = this.prototype, o.prototype = new r, o
						})
					},
					function(t, e, n) {
						e.__esModule = !0;
						var r = a(n(14)),
							o = (a(n(130)), a(n(129))),
							i = a(n(104)),
							u = a(n(103)),
							c = a(n(65));

						function a(t) {
							return t && t.__esModule ? t : {
								"default": t
							}
						}
						var s = (f.getInstance = function() {
							return window.MarsTracker || (window.MarsTracker = new f),
								window.MarsTracker
						}, f);

						function f() {
							return (0, r["default"])(this, f), new u["default"]({
								middleware: [new o["default"], new i["default"]],
								data: c["default"]["default"]
							})
						}
						e["default"] = s.getInstance()
					}
				], r.c = o, r.d = function(t, e, n) {
					r.o(t, e) || Object.defineProperty(t, e, {
						configurable: !1,
						enumerable: !0,
						get: n
					})
				},
				r.r = function(t) {
					Object.defineProperty(t, "__esModule", {
						value: !0
					})
				}, r.n = function(t) {
					var e = t && t.__esModule ? function() {
						return t["default"]
					} : function() {
						return t
					};
					return r.d(e, "a", e), e
				}, r.o = function(t, e) {
					return Object.prototype.hasOwnProperty.call(t, e)
				}, r.p = "", r(r.s = 131))["default"];

			function r(t) {
				if (o[t]) return o[t].exports;
				var e = o[t] = {
					i: t,
					l: !1,
					exports: {}
				};
				return n[t].call(e.exports, e, e.exports, r), e.l = !0, e.exports
			}
			var n, o
		})
	}, {}]
}, {}, [2]);
