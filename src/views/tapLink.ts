interface imageCell {
    // json路径
    path: string;
    // 编辑标题
    title: string;
    // set
    set: string;
    // tab
    tab: string;
    // 图片大小
    imgSize: number;
}

interface textCell {
    // json路径
    path: string;
    // 编辑标题
    title: string;
    // set
    set: string;
    // tab
    tab: string;
    // boxshow
    boxShow: boolean;
}

interface styleCell {
    // json路径
    path: string;
    // 编辑标题
    title: string;
}


class TapMessage {
    image?: imageCell | Array<imageCell>;
    text?: textCell;
    style?: styleCell;
    type: string = 'white';
    // 构造函数
    constructor(name: string) {
        if (name === 'background') {
            this.image = [{
                path: "activity.templet_set.background_pic",
                title: "活动背景图",
                set: "base",
                tab: "base",
                imgSize: 2000,
            }];
        }
        if (name === 'title') {
            this.image = [{
                path: "activity.templet_set.title_pic",
                title: "活动标题图",
                set: "base",
                tab: "base",
                imgSize: 500,
            }];
        }
        if (name === 'sub_name') {
            this.text = {
                path: "activity.templet_set.sub_name",
                title: "活动副标题",
                set: "base",
                tab: "base",
                boxShow: false
            };
        }
        if (name == 'share_title') {
            this.text = {
                path: "activity.share_set.share_title",
                title: "分享标题",
                set: "share",
                tab: "base",
                boxShow: false
            };
            this.type = 'black';
        }
        if (name == 'share_desc') {
            this.text = {
                path: "activity.share_set.share_desc",
                title: "分享描述",
                set: "share",
                tab: "base",
                boxShow: false
            };
            this.type = 'black';
        }
        if (name == 'share_pic') {
            this.text = {
                path: "activity.share_set.share_pic",
                title: "分享缩略图",
                set: "share",
                tab: "base",
                boxShow: false
            };
            this.type = 'black';
        }
    }
}

export { TapMessage };