function getLetterLength(str) {
	if (/[a-oq-z]/i.test(str)) {
		return str.match(/[a-oq-z]/ig).length;
	}
	return 0;
}

function allIsChinese(str) {
	var reg = /^[\u4E00-\u9FA5]{1,300}$/;
	return reg.test(str)
}
//从items列表中收集ID成数组集合
function getItemsId(list) {
	let defaultCheckKeys = [];
	list.forEach(function(element) {
		defaultCheckKeys.push(element.id);
	});
	return defaultCheckKeys;
}

function getMenuTreeList(listOld) {
	var listNew = [];
	var menuList = [];
	var menuListIndex = [];
	for (var i = 0; i < listOld.length; i++) {
		if (listOld[i].parentId == null) {
			menuList.push(listOld[i]);
			menuListIndex.push(listOld[i].id);
		}
	}
	listNew = listOld.filter((item) => !menuListIndex.includes(item.id));
	for (let i = 0; i < listNew.length; i++) {
		for (let j = 0; j < menuList.length; j++) {
			if (listNew[i].parentId == menuList[j].id) {
				if (!menuList[j].children) {
					menuList[j].children = [];
				}
				menuList[j].children.push(listNew[i]);
			}
		}
	}
	return menuList;
}


function formClear(params) {
	var keys = Object.keys(params);
	var form = params;
	for (var i = 0; i < keys.length; i++) {
		form[keys[i]] = '';
	}
	return form;
}
function hasNull(params) {
	var keys = Object.keys(params);
	for (var i = 0; i < keys.length; i++) {
		var obj = params[keys[i]];
		console.log(keys[i],obj,obj == "")
		if (obj===null || obj === "") {
			return true;
		}
	}
	return false;
}

function hasVal(params) {
	var keys = Object.keys(params);
	for (var i = 0; i < keys.length; i++) {
		var obj = params[keys[i]];
		if (obj) {
			return true;
		}
	}
	return false;
}

function clearSpecialStrict(s) {
	// 去掉转义字符  
	s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
	// 去掉特殊字符
	s = s.replace(/[\@\#\$\%\^\&\*\{\}\<\>\.]/g, '');
	return s;
};

export default {
	hasNull,
	hasVal,
	getLetterLength,
	allIsChinese,
	getItemsId,
	getMenuTreeList,
	formClear,
	clearSpecialStrict
}
