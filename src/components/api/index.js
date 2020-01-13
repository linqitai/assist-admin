// const host = 'http://www.dtc233.com/api/admin/'
const host = '/bfl/'
// export const ERR_OK = 200

// 登录接口
// export const loginUrl = host + 'admin/login';

export default{
	//CONST
	ERR_OK: 200,
	ERR_NO: 500,
	UNLOGIN: 4001,
	UNAUTH: 4002,
	login: host + 'admin/login/login',
	//role
	getAdminRolePageList: host + "admin/role/getAdminRolePageList",
	insertAdminRole: host + "admin/role/insertAdminRole",
	updateAdminRole: host + "admin/role/updateAdminRole",
	deletedAdminRole: host + "admin/role/deletedAdminRole/",
	getMenuListByRoleId: host + "admin/roleMenu/getMenuListByRoleId/",
	insertAdminRoleMenu: host + "admin/roleMenu/insertAdminRoleMenu",
	//user
	getAdminUserPageList: host + "admin/user/getAdminUserPageList",
	insertAdminUser: host + "admin/user/insertAdminUser",
	editAdminUser: host + "admin/user/updateAdminUser",
	deletedAdminUserByUserId: host + "admin/user/deletedAdminUserByUserId/",
	updateUserActivedByUserId: host + "admin/userInfo/updateUserActivedByUserId",
	//userinfo
	getAssistUserInfoPageList: host +'/admin/userInfo/getAssistUserInfoPageList',
	getUserIdByPhone: host + "admin/userInfo/getUserIdByPhone",
	//menu
	getMenuPageList: host + "admin/menu/getMenuPageList",
	insertMenu: host + "admin/menu/insertMenu",
	updateMenu: host + "admin/menu/updateMenu",
	deletedMenuByMenuId: host + "admin/menu/deletedMenuByMenuId/",
	//agency
	getAssistProvinceAgentListByPage: host + "admin/provinceAgent/getAssistProvinceAgentListByPage",
	insertProvinceAgent: host + "admin/provinceAgent/insertProvinceAgent",
	updateProvinceAgent: host + "admin/provinceAgent/updateProvinceAgent",
	deletedProvinceAgent: host + "admin/provinceAgent/deletedProvinceAgent/",
	getCityAgentPageList: host + "admin/cityAgent/getCityAgentPageList",
	getCityAgentListMoreInfo: host + "admin/cityAgent/getCityAgentListMoreInfo",
	insertCityAgent: host + "admin/cityAgent/insertCityAgent",
	updateCityAgent: host + "admin/cityAgent/updateCityAgent",
	deletedCityAgent: host + "admin/cityAgent/deletedCityAgent/",
	//vote
	insertAssistVote: host + "admin/assistVote/insertAssistVote",
	getAssistVoteList: host + "admin/assistVote/getAssistVoteList",
	deleteAssistVoteById: host + "admin/assistVote/deleteAssistVoteById/",
	updateAssistVote: host + "admin/assistVote/updateAssistVote",
	//voteQuestion
	insertAssistQuestion: host + "admin/question/insertAssistQuestion",
	getAssistQuestionList: host + "admin/question/getAssistQuestionList",
	updateAssistQuestion: host + "admin/question/updateAssistQuestion",
	deleteAssistQuestionById: host + "admin/question/deleteAssistQuestionById/",
	//矿机
	insertAssistMiningMachine:host + "admin/miningMachine/insertAssistMiningMachine",
	getAssistMiningMachineList:host + "admin/miningMachine/getAssistMiningMachineList",
	updateAssistMiningMachine:host + "admin/miningMachine/updateAssistMiningMachine",
	deleteAssistMiningMachine: host + "admin/miningMachine/deleteAssistMiningMachine/",
	giveMyMachine: host + "admin/myMachine/giveMyMachine",
	//交易信息
	getAssistTransactionListByPage: host + "admin/transaction/getAssistTransactionListByPage",
	cancelAssistTransactionById: host + "admin/transaction/cancelAssistTransactionById",
	//公告管理
	getNoticePageList: host + "admin/notice/getNoticePageList",
	updateNotice: host + "admin/notice/updateNotice",
	insertNotice: host + "admin/notice/insertNotice",
	deletedNotice: host + "admin/notice/deletedNotice/",
	//留言板管理
	updateAssistMessageBoard: host + "admin/messageBoard/updateAssistMessageBoard",
	getAssistMessageBoardPageList: host + "admin/messageBoard/getAssistMessageBoardPageList",
	//platformTicket
	getAssistPlateformTicketAccountBookList: host + "admin/plateformTicketAccountBook/getAssistPlateformTicketAccountBookList",
	transferPlatformTicket: host + "admin/plateformTicketAccountBook/transferPlatformTicket",
  //userFreeze
  insertAssistUserFreeze: host + "admin/userFreeze/insertAssistUserFreeze",
  getAssistUserFreezePageList: host + "admin/userFreeze/getAssistUserFreezePageList",
  unFreeze: host + "admin/userFreeze/unFreeze"
}
