import {ObjectId} from 'bson';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from './types/common';

export const availableAgentSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews", "memberRank"];
export const availableMemberSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews"];

export const availableOptions = ['propertyBarter', 'propertyRent'];
export const availablePropertySorts = [
	'createdAt',
	'updatedAt',
	'propertyLikes',
	'propertyViews',
	'propertyRank',
	'propertyPrice'
];
export const availableBoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews'];
export const availableCommentSorts = ['createdAt', 'updatedAt'];


/** IMAGE CONFIGURATION **/
export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};


export const shapeIntoMongoObjectId = (target: any) => {
  return typeof target === 'string' ? new ObjectId(target) : target
};



export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = "$_id") => {
	return {
		$lookup: {
			// 1-STEP
			from: "likes",
			

			// 2-STEP $let bu yerda shu queryni ichida ishlatish uchun local variable lar yasash uchun ishlatilarkan?
			let: { 
				localLikeRefId: targetRefId,  // property ning id si
				localMemberId: memberId, // Authenticated bo'lgan user id si
				localMyFavorite: true // Favorite true 
			},


			// 3-STEP $pipeline bizga array qaytaradi
			pipeline: [
				
				// 3.1 $match match ichida localField bilan Foreign field ichidaga field larni solishtirish amalani qo'llayapmiz. 
				// Ya'ni likes collection ichidagi 
				// 	- likeRefId bilan properties collection ichidagi localLikeRefId > targetRefId=$id => propertyId ni solishtiryapmiz 
				// 	- memberId bilan properties collection ichidagi localMemberId=AuthMemberId ni solishtiryapmiz 

				{
					$match: {
						$expr: {
							$and: [ 
								{ $eq: ["$likeRefId", "$$localLikeRefId"] }, 
								{ $eq: ["$memberId", "$$localMemberId"] } 
							],
						},
					},
				},

				/** 
				  {
						"_id": "6860966c65c8075358018031",
						"likeGroup" : "MEMBER",
						"likeRefId" : "684e2903e316d12c362407b8",
						"memberId"  : "684e2979e316d12c362407c6",
						"createdAt" : "2025-06-29T01:27:08.482+00:00",
						"updatedAt" : "2025-06-29T01:27:08.482+00:00"			 
					}
				**/



				// 3.2 $project ichida biz likes dan kelayotgan Document ichida Datasetlar ni biz yasagan meLiked DTO ga moslayapmiz.
				{
					$project: {
						_id: 0,
						memberId: 1,
						likeRefId: 1,
						myFavorite: '$$localMyFavorite',
					},
				},	
			],


			// 4-STEP
			as: "meLiked",
		},
	};
};





interface LookUpAuthMemberFollowed {
	followerId: T;
	followingId: string;
}
export const lookupAuthMemberFollowed = (input: LookUpAuthMemberFollowed) => {
	const { followerId, followingId } = input;
	return {
		$lookup: {
			from: "follows",
			let: {
				localFollowerId: followerId,
				localFollowingId: followingId,
				localMyFavorite: true
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [ { $eq: ["$followerId", "$$localFollowerId"] }, { $eq: ["$followingId", "$$localFollowingId"] } ],
						},
					},
				},
				{
					$project: {
						_id: 0,
						followerId: 1,
						followingId: 1,
						myFollowing: '$$localMyFavorite',
					},
				},	
			],
			as: "meFollowed",
		},
	};
};


 
export const lookupMember = {
	$lookup: {
		from: 'members',
		localField: 'memberId',
		foreignField: '_id',
		as: 'memberData',
	},
};

export const lookupFollowingData = {
	$lookup: {
		from: 'members',
		localField: 'followingId',
		foreignField: '_id',
		as: 'followingData',
	},
};

export const lookupFollowerData = {
	$lookup: {
		from: 'members',
		localField: 'followerId',
		foreignField: '_id',
		as: 'followerData',
	},
};

export const lookupFavorite = {
	$lookup: {
		from: 'members',
		localField: 'favoriteProperty.memberId',
		foreignField: '_id',
		as: 'favoriteProperty.memberData',
	},
};

export const lookupVisit = {
	$lookup: {
		from: 'members',
		localField: 'visitedProperty.memberId',
		foreignField: '_id',
		as: 'visitedProperty.memberData',
	},
};