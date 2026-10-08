/**
 * 数据与文案规格定义
 * 严格遵循 PRD 规范：
 * 1. 她的原文一个字都不进网站（只用转述与事实）
 * 2. 每一个模块都是事实或物件，不是辩解
 * 3. 绝无任何问句、索求与承诺
 */

export interface DualContrastItem {
  id: number;
  thought: string; // 我当时以为的
  truth: string;   // 后来的实情
}

export interface IOUItem {
  id: number;
  recordedByHer: string; // 她记的
  myRealityThen: string;  // 我当时的实情
  myRealizationNow: string; // 我后来明白的
}

export interface TimelineObjectItem {
  id: number;
  word: string;
  detail: string;
}

export interface DictionaryItem {
  term: string;
  pinyin?: string;
  origin: string;
}

export const SITE_DATA = {
  cover: {
    mainTitle: "10.2 — 10.7",
    subTitleTag: "旭旭 与 鑫鑫",
    tagline: "一个真实发生过的故事，我把它做成了一个东西。",
    buttonText: "走一遍",
  },

  // 模块 1 · 双栏对照（8 组）
  contrasts: [
    {
      id: 1,
      thought: "她在大厅不说话，是不爱理我",
      truth: "她也在挑人。她习惯被踢",
    },
    {
      id: 2,
      thought: "她不想跟我玩",
      truth: "她夹在我和另一个人中间。最后她谁都没选，自己一个人玩",
    },
    {
      id: 3,
      thought: "她不回我，是冷淡",
      truth: "她不知道该回什么",
    },
    {
      id: 4,
      thought: "\"萌新\"那件事她只是笑了一下",
      truth: "那是她开始不相信我的那一天",
    },
    {
      id: 5,
      thought: "她生气是因为我没礼貌",
      truth: "她生气是因为\"我只存在于晚上\"",
    },
    {
      id: 6,
      thought: "我在等她",
      truth: "她一直在等我主动一次",
    },
    {
      id: 7,
      thought: "我以为这段关系只有我在投入",
      truth: "她翻出很久没用的语音软件，就为了能进我的语音房",
    },
    {
      id: 8,
      thought: "我以为那只是几天",
      truth: "她把每一天都记下来了，从 10.4 到 10.7",
    },
  ] as DualContrastItem[],

  // 模块 2 · 四条欠条 · 我这里的真相
  ious: [
    {
      id: 1,
      recordedByHer: "他说给我看看电脑",
      myRealityThen: "我每天都准备给她看。早了她要打游戏，晚了她要睡觉",
      myRealizationNow: "我在等一个合适的时机。而那个时机从来不会自己出现。",
    },
    {
      id: 2,
      recordedByHer: "日记写了再发给我看",
      myRealityThen: "我怕新内容太少，她看不过瘾",
      myRealizationNow: "我以为攒够了才叫分享，其实她想看的只是当时的我在做什么。",
    },
    {
      id: 3,
      recordedByHer: "在等我一起玩",
      myRealityThen: "我知道她的避讳和脆弱，不太敢主动约",
      myRealizationNow: "不打扰在对方眼里，往往就只是没有被记挂。",
    },
    {
      id: 4,
      recordedByHer: "下次再哄",
      myRealityThen: "我怀疑我从没说过这话。我每次都以为我哄好了",
      myRealizationNow: "情绪没有真正过去，只是被我自以为是地翻篇了。",
    },
  ] as IOUItem[],

  // 模块 3 · 时间线：那些物件（8 个物件）
  objectsTimeline: [
    {
      id: 1,
      word: "摇一摇",
      detail: "我摇到一个 0 伤害的新手。她摇到一个不说话的新手。",
    },
    {
      id: 2,
      word: "三级甲",
      detail: "她丢给我一个。我转头跟朋友炫耀了两次。",
    },
    {
      id: 3,
      word: "二级甲",
      detail: "我故意捡起来标记，就为了再炫一次。",
    },
    {
      id: 4,
      word: "都怪你",
      detail: "桥头。她嗔我一句。我在这边没开麦傻笑了。",
    },
    {
      id: 5,
      word: "钥匙",
      detail: "我向队友讨来给她。她后来写：我学到了，先开口万一真的成真了呢。",
    },
    {
      id: 6,
      word: "两个名字",
      detail: "电话里说好的。我叫她鑫鑫，她叫我旭旭。",
    },
    {
      id: 7,
      word: "直播写日记",
      detail: "我开着会议写，她在那边看。",
    },
    {
      id: 8,
      word: "95 段",
      detail: "她写了一份东西给我。",
    },
  ] as TimelineObjectItem[],

  // 模块 4 · 我们的词典（7 个词条）
  dictionary: [
    {
      term: "旭旭",
      pinyin: "xù xù",
      origin: "电话里她给我起的名字。",
    },
    {
      term: "鑫鑫",
      pinyin: "xīn xīn",
      origin: "电话里我给她起的名字。",
    },
    {
      term: "摇一摇",
      pinyin: "yáo yì yáo",
      origin: "游戏大厅里的初次匹配，两个各自迷茫的新人。",
    },
    {
      term: "三级甲",
      pinyin: "sān jí jiǎ",
      origin: "游戏里她丢给我的高级护甲，在朋友面前炫耀了很久。",
    },
    {
      term: "魔王护",
      pinyin: "mó wáng hù",
      origin: "为她挡在前面的瞬间与守护的标记。",
    },
    {
      term: "都怪你",
      pinyin: "dōu guài nǐ",
      origin: "桥头走错路时的一句娇嗔，没开麦却偷笑了很久。",
    },
    {
      term: "慢慢",
      pinyin: "màn màn",
      origin: "一份文档的名字。",
    },
  ] as DictionaryItem[],

  // 模块 5 · 上锁的盒子
  lockedBox: {
    line1: "她写了一份东西给我。",
    line2: "我没有动它。",
    tip: "这把锁打不开，也不必打开。",
  },

  // 模块 6 · 结尾
  ending: {
    line1: "8 条语音。0 条回复。",
    line2: "我以前冷漠，并没有什么好结果。\n我决定重新爱一次。",
  },
};
