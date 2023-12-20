/**
 * Notes: 全局/首页模块业务逻辑
 * Date: 2021-03-15 04:00:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectService = require('./base_project_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const setupUtil = require('../../../framework/utils/setup/setup_util.js');
const ActivityModel = require('../model/activity_model.js');

class HomeService extends BaseProjectService {

	async getSetup(key) {
		return await setupUtil.get(key);
	}

	/**首页列表 */
	async getHomeList() {
		let fields = 'ACTIVITY_START_DAY,ACTIVITY_END_DAY,ACTIVITY_START,ACTIVITY_TITLE,ACTIVITY_CATE_NAME,ACTIVITY_JOIN_CNT,ACTIVITY_MAX_CNT,ACTIVITY_STATUS,ACTIVITY_END,ACTIVITY_STOP,ACTIVITY_OBJ.cover,ACTIVITY_OBJ.city';
		let where = {
			ACTIVITY_STATUS: 1,
			ACTIVITY_VOUCH: 1
		}

		let vouchList = await ActivityModel.getAll(where, fields, { 'ACTIVITY_VOUCH': 'desc', 'ACTIVITY_ADD_TIME': 'desc' }, 10);

		if (vouchList.length == 0) {
			vouchList = await ActivityModel.getAll({ ACTIVITY_STATUS: 1 }, fields, { 'ACTIVITY_VOUCH': 'desc', 'ACTIVITY_ADD_TIME': 'desc' }, 10);
		}

		const ActivityService = require('../service/activity_service.js');
		let activityService = new ActivityService();
		for (let k = 0; k < vouchList.length; k++) {
			vouchList[k].statusDesc = activityService.getJoinStatusDesc(vouchList[k]); 
		}

		return { vouchList }

	}
}

module.exports = HomeService;