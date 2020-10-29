import {$fetch} from "../utils/fetchOrAjax";
import {HTTPCnst} from "../service/httpCnst";
// 获取在线考试试题
export const getExamList = (data) => $fetch(`${HTTPCnst.shopguide_url}exam/user/waitExamList`, data, "get");
// 获取考试试题
export const getExamListByTaskId = (data) => $fetch(`${HTTPCnst.shopguide_url}newTask/getExamList`, data, "get");
export const getExamAfterList = (data) => $fetch(`${HTTPCnst.shopguide_url}newTask/getExamAfterList`, data, "get");
// 获取已完成考试列表
export const getFinishExamList = (data) => $fetch(`${HTTPCnst.shopguide_url}exam/user/finishExamList`, data, "get");
// 获取考试信息
export const getOneHistoryExamQuestionInfo = (data) => $fetch(`${HTTPCnst.shopguide_url}exam/user/getOneHistoryExamQuestionInfo`, data, "get");
// 获取考试试题
export const getExamQuestionInfoByExamId = (data) => $fetch(`${HTTPCnst.shopguide_url}exam/getExamQuestionInfoByExamId`, data, "get");
// 提交考试分析
export const addGameTaskStatistics = (data) => $fetch(`${HTTPCnst.shopguide_url}newTask/addGameTaskStatistics`, data, "post");



//文章详情获取用户信息
export const getArticleInfo=(data)=>$fetch(`${HTTPCnst.H5_url}cms/article/info`,data,'get');

//用户信息获取by id
export const getUserByuserIds= (data) => $fetch(`${HTTPCnst.H5_url}user`,data,'get');

//获取点赞列表
export const getPraiseData = (data) => $fetch(`${HTTPCnst.H5_url}cms/praise`,data,'get');

//获取帖子评论列表
export const getDiscussData = (data) => $fetch(`${HTTPCnst.H5_url}cms/discuss`,data,'get','',{});

//提交点赞文章
export const addPraise = (data) => $fetch(`${HTTPCnst.H5_url}cms/praise`,data,'get');

//取消点赞文章
export const delPraise = (data) => $fetch(`${HTTPCnst.H5_url}cms/praise/del`,data,'post','',{
  'Content-Type': 'application/json'
});
//提交文章评论
export const articleDiscuss = (data) => $fetch(`${HTTPCnst.H5_url}cms/discuss?discussType=articleComment`,data,'post',{
  'Accept': 'application/json',
  'Content-Type': 'application/json'
})

//提交收藏文章
export const addFavorite = (data) => $fetch(`${HTTPCnst.H5_url}game/favorite`,data,'get');
export const getUserId = (data) => $fetch(`${HTTPCnst.user_Url}game/getUser`,data,'get');
// // 获取课程详情
// export const getCourseCommentNumsScorenNums = (data) => $fetch(`${HTTPCnst.shopguide_url}newTask/getCourseCommentNumsScorenNums`, data, "get");
// // 获取查看人数
// export const getFindBrowsRecordAndSave = (data) => $fetch(`${HTTPCnst.shopguide_url}contmgn/findBrowsRecordAndSave`, data, "get");
// // 获取点赞列表数据
// export const getFavourList = (data) => $fetch(`${HTTPCnst.shopguide_url}bbs/getFavourList`, data, "get");
// // 获取评论列表数据
// export const getCommentLIst = (data) => $fetch(`${HTTPCnst.shopguide_url}game/getCourseCommentByCourseId`, data, "get");

