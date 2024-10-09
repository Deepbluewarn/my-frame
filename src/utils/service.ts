export const getVisibilityPipeline = (viewerId?: string) => {
    return [
        {
            $addFields: {
                isOwner: viewerId ? { $eq: ['$owner', viewerId] } : false,
                isFollowing: viewerId ? {
                    $cond: {
                        if: { $eq: ['$visibility', 'follow'] },
                        then: { $in: [viewerId, { $ifNull: ['$ownerDetails.following', []] }] },
                        else: true
                    }
                } : false
            }
        },
        {
            $match: {
                $or: [
                    { isOwner: true },
                    { isFollowing: true },
                    { visibility: 'public' }
                ]
            }
        },
        {
            $project: {
                isOwner: 0,
                isFollowing: 0
            }
        }
    ]
};
