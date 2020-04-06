import config from "./config.js";

function getUserType(val){
	if(val==0){
		return '管理员';
	}else if(val==1){
		return '客服';
	}else{
		return val;
	}
}

function getUserLevel(val) {
	if (val == 1) {
		return '青铜';
	} else if (val == 2) {
		return '白银';
	} else if(val == 3) {
		return '黄金';
	} else if (val == 4) {
		return '铂金';
	} else if (val == 5) {
		return '钻石';
	} else {
		return val;
	}
}

function getRoleType(val){
	if(val==0){
		return '管理角色';
	}else if(val==1){
		return '普通角色';
	}else{
		return val;
	}
}

function menuType(val){
	if(val==0){
		return '导航类菜单';
	}else if(val==1){
		return '接口类菜单';
	}else{
		return val;
	}
}
//菜单等级
function levelType(val){
	if(val==0){
		return '一级';
	}else if(val==1){
		return '二级';
	}else if(val==2){
		return '三级';
	}else{
		return val;
	}
}
let agencyStatusOptions = [{
		id: 0,
		value: "未开拍"
	},
	{
		id: 1,
		value: "竞拍中"
	},
	{
		id: 2,
		value: "已截止"
	}
]
//省市代理的状态
function agencyStatusType(val){
	if(val == 0) {
		return agencyStatusOptions[0].value;
	}
	if(val){
		return agencyStatusOptions[val].value;
	}else{
		return val;
	}
}
//是否缴纳
function isPayType(val){
	if(val==0){
		return '否';
	}else if(val==1){
		return '是';
	}else{
		return val;
	}
}
//isNull return --
function isNullReturnLine(val){
	if(val==null||val=='--'){
		return '--';
	}else{
		return val;
	}
}
//投票选择类型
function voteType(val){
	if(val==1){
		return '单选';
	}else if(val==2){
		return '多选';
	}else{
		return val;
	}
}

const versionOptions = [{ id:1,value:'1' }, { id:2,value:'2' }, { id:3,value:'3' }, { id:4,value:'4' }, { id:5,value:'5' }, { id:6,value:'6' }];
//矿机版本号
function machineVersionType(val){
	let value = versionOptions[val-1].value;
	return value;
}
const isOrNoOptions = [{id:0,value:'否'},{id:1,value:'是'}];
//是否
function isOrNo(val){
	if(val == 0){
		return isOrNoOptions[0].value;
	}
	if(val==1){
		return isOrNoOptions[1].value;
	}
  if(val == -1){
  	return '未实名';
  }
  if(val==2){
  	return '审核驳回';
  }
	if(val==false){
		return isOrNoOptions[0].value;
	}
	if(val==true){
		return isOrNoOptions[1].value;
	}
}

const machineTagOptions = config.machineTagOptions;
//矿机标签
function machineTagType(val){
	let value = machineTagOptions[val].value;
	return value;
}

const machineTypeOptions = config.machineTypeOptions;
//矿机标签
function machineTypeType(val){
	let value = machineTypeOptions[val].value;
	return value;
}

const dealStatusOptions = config.dealStatusOptions;
//交易状态
function dealStatusType(val){
	return dealStatusOptions[val+1].value;
}
const dealTypeOptions = config.dealTypeOptions;
//交易类型
function dealType(val){
	if(val==0){
		return dealTypeOptions[0].value;
	}else if(val>0){
		return dealTypeOptions[val].value;
	}else{
		return val;
	}
}

//公告类型
function noticeType(val){
	if(val==0){
		return '普通';
	}else if(val==1){
		return '轮播图';
	}else if(val==2){
		return '图片公告';
	}
}

//留言类型
function wordType(val){
	if (val == 0) {
		return '问题反馈';
	} else if (val == 1) {
		return '意见建议';
	} else if (val == 2) {
		return '打小报告';
	} else if (val == 3) {
		return '其他类型';
	} else {
		return val;
	}
}

// console.log('config.platformTicketBookTypeOptions',config.platformTicketBookTypeOptions);
const platformTicketBookTypeOptions = config.platformTicketBookTypeOptions;
function platformBookType(val){
	 return platformTicketBookTypeOptions[val + 1].value;
}

const contributionTypeOptions = config.contributeTypeOptions;
function contributionType(val){
	 return contributionTypeOptions[val].value;
}

const activedOptions = config.activedOptions;
function activedType(val){
	return activedOptions[val + 1].value;
}

// 获取年月日
function getDateYMD(t) {
  let time = new Date(t)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
}

function accountStatus(val){
	if(val==0){
		return '正常';
	}else if(val==1){
		return '冻结中';
	}else{
		return val;
	}
}

function canUnFreeze(val){
	if(val==0){
		return '需要给客服排查问题';
	}else if(val==1){
		return '可以让省市代理解冻';
	}else{
		return val;
	}
}

export {
	getUserType,getRoleType,menuType,levelType,agencyStatusType,agencyStatusOptions,getUserLevel,
  isPayType,isNullReturnLine,isOrNo,voteType,machineVersionType,versionOptions,isOrNoOptions,
  machineTagOptions,machineTypeOptions,machineTagType,machineTypeType,dealStatusType,dealStatusOptions,
  dealType,noticeType,wordType,platformBookType,contributionType,activedType,getDateYMD,accountStatus,canUnFreeze
}
