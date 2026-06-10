import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ─── Embedded vocabulary dataset ───
// Format: [kanji ("" if kana-only/katakana word), kana, meaning, pos, jlptLevel]
// pos: n = noun, v = verb, adj = adjective (i + na), adv = adverb
const VOCAB = [
// ===== N5 — NOUNS =====
["私","わたし","I, me","n",5],
["人","ひと","person","n",5],
["男","おとこ","man, male","n",5],
["女","おんな","woman, female","n",5],
["子供","こども","child","n",5],
["友達","ともだち","friend","n",5],
["先生","せんせい","teacher","n",5],
["学生","がくせい","student","n",5],
["家族","かぞく","family","n",5],
["父","ちち","father","n",5],
["母","はは","mother","n",5],
["兄","あに","older brother","n",5],
["姉","あね","older sister","n",5],
["弟","おとうと","younger brother","n",5],
["妹","いもうと","younger sister","n",5],
["名前","なまえ","name","n",5],
["家","いえ","house, home","n",5],
["学校","がっこう","school","n",5],
["大学","だいがく","university","n",5],
["会社","かいしゃ","company","n",5],
["銀行","ぎんこう","bank","n",5],
["病院","びょういん","hospital","n",5],
["駅","えき","station","n",5],
["店","みせ","shop, store","n",5],
["部屋","へや","room","n",5],
["台所","だいどころ","kitchen","n",5],
["玄関","げんかん","entrance hall","n",5],
["窓","まど","window","n",5],
["机","つくえ","desk","n",5],
["椅子","いす","chair","n",5],
["本","ほん","book","n",5],
["辞書","じしょ","dictionary","n",5],
["新聞","しんぶん","newspaper","n",5],
["雑誌","ざっし","magazine","n",5],
["手紙","てがみ","letter (mail)","n",5],
["写真","しゃしん","photograph","n",5],
["映画","えいが","movie","n",5],
["音楽","おんがく","music","n",5],
["歌","うた","song","n",5],
["絵","え","picture, painting","n",5],
["電話","でんわ","telephone","n",5],
["時計","とけい","clock, watch","n",5],
["傘","かさ","umbrella","n",5],
["鞄","かばん","bag","n",5],
["靴","くつ","shoes","n",5],
["服","ふく","clothes","n",5],
["帽子","ぼうし","hat, cap","n",5],
["眼鏡","めがね","glasses","n",5],
["鍵","かぎ","key","n",5],
["車","くるま","car","n",5],
["自転車","じてんしゃ","bicycle","n",5],
["電車","でんしゃ","train","n",5],
["飛行機","ひこうき","airplane","n",5],
["地下鉄","ちかてつ","subway","n",5],
["道","みち","road, way","n",5],
["橋","はし","bridge","n",5],
["川","かわ","river","n",5],
["山","やま","mountain","n",5],
["海","うみ","sea, ocean","n",5],
["空","そら","sky","n",5],
["雨","あめ","rain","n",5],
["雪","ゆき","snow","n",5],
["風","かぜ","wind","n",5],
["天気","てんき","weather","n",5],
["花","はな","flower","n",5],
["木","き","tree, wood","n",5],
["犬","いぬ","dog","n",5],
["猫","ねこ","cat","n",5],
["鳥","とり","bird","n",5],
["魚","さかな","fish","n",5],
["肉","にく","meat","n",5],
["野菜","やさい","vegetable","n",5],
["果物","くだもの","fruit","n",5],
["卵","たまご","egg","n",5],
["牛乳","ぎゅうにゅう","milk","n",5],
["水","みず","water","n",5],
["お茶","おちゃ","tea","n",5],
["ご飯","ごはん","cooked rice, meal","n",5],
["朝ご飯","あさごはん","breakfast","n",5],
["昼ご飯","ひるごはん","lunch","n",5],
["晩ご飯","ばんごはん","dinner","n",5],
["料理","りょうり","cooking, dish","n",5],
["砂糖","さとう","sugar","n",5],
["塩","しお","salt","n",5],
["醤油","しょうゆ","soy sauce","n",5],
["お酒","おさけ","alcohol, sake","n",5],
["朝","あさ","morning","n",5],
["昼","ひる","noon, daytime","n",5],
["夜","よる","night","n",5],
["今日","きょう","today","n",5],
["明日","あした","tomorrow","n",5],
["昨日","きのう","yesterday","n",5],
["今","いま","now","n",5],
["時間","じかん","time, hour","n",5],
["毎日","まいにち","every day","n",5],
["毎朝","まいあさ","every morning","n",5],
["毎晩","まいばん","every night","n",5],
["今週","こんしゅう","this week","n",5],
["来週","らいしゅう","next week","n",5],
["先週","せんしゅう","last week","n",5],
["今月","こんげつ","this month","n",5],
["来月","らいげつ","next month","n",5],
["先月","せんげつ","last month","n",5],
["今年","ことし","this year","n",5],
["去年","きょねん","last year","n",5],
["来年","らいねん","next year","n",5],
["春","はる","spring (season)","n",5],
["夏","なつ","summer","n",5],
["秋","あき","autumn","n",5],
["冬","ふゆ","winter","n",5],
["誕生日","たんじょうび","birthday","n",5],
["休み","やすみ","holiday, day off","n",5],
["仕事","しごと","work, job","n",5],
["宿題","しゅくだい","homework","n",5],
["質問","しつもん","question","n",5],
["問題","もんだい","problem, question","n",5],
["言葉","ことば","word, language","n",5],
["英語","えいご","English language","n",5],
["日本語","にほんご","Japanese language","n",5],
["外国","がいこく","foreign country","n",5],
["外国人","がいこくじん","foreigner","n",5],
["国","くに","country","n",5],
["町","まち","town","n",5],
["村","むら","village","n",5],
["所","ところ","place, spot","n",5],
["地図","ちず","map","n",5],
["公園","こうえん","park","n",5],
["図書館","としょかん","library","n",5],
["喫茶店","きっさてん","coffee shop, cafe","n",5],
["食堂","しょくどう","cafeteria, dining hall","n",5],
["郵便局","ゆうびんきょく","post office","n",5],
["交番","こうばん","police box","n",5],
["切手","きって","postage stamp","n",5],
["切符","きっぷ","ticket","n",5],
["お金","おかね","money","n",5],
["体","からだ","body","n",5],
["頭","あたま","head","n",5],
["顔","かお","face","n",5],
["目","め","eye","n",5],
["耳","みみ","ear","n",5],
["口","くち","mouth","n",5],
["鼻","はな","nose","n",5],
["手","て","hand","n",5],
["足","あし","foot, leg","n",5],
["声","こえ","voice","n",5],
["病気","びょうき","illness, sickness","n",5],
["薬","くすり","medicine","n",5],
["医者","いしゃ","doctor","n",5],
["お風呂","おふろ","bath","n",5],
["電気","でんき","electricity, light","n",5],
["色","いろ","color","n",5],
["紙","かみ","paper","n",5],
["旅行","りょこう","trip, travel","n",5],
["", "テレビ","television","n",5],
["", "ラジオ","radio","n",5],
["", "パソコン","personal computer","n",5],
["", "カメラ","camera","n",5],
["", "ホテル","hotel","n",5],
["", "レストラン","restaurant","n",5],
["", "デパート","department store","n",5],
["", "スーパー","supermarket","n",5],
["", "コンビニ","convenience store","n",5],
["", "エレベーター","elevator","n",5],
["", "ドア","door","n",5],
["", "テーブル","table","n",5],
["", "ベッド","bed","n",5],
["", "プール","swimming pool","n",5],
["", "ニュース","news","n",5],
["", "アパート","apartment","n",5],
["", "トイレ","toilet","n",5],
["", "ポケット","pocket","n",5],
["", "ボタン","button","n",5],
["", "シャツ","shirt","n",5],
["", "ズボン","trousers, pants","n",5],
["", "コート","coat","n",5],
["", "セーター","sweater","n",5],
["", "ネクタイ","necktie","n",5],
["", "ハンカチ","handkerchief","n",5],
["", "コップ","glass, tumbler","n",5],
["お皿","おさら","plate, dish","n",5],
["箸","はし","chopsticks","n",5],
["", "ナイフ","knife","n",5],
["", "フォーク","fork","n",5],
["", "スプーン","spoon","n",5],
["", "コーヒー","coffee","n",5],
["", "ジュース","juice","n",5],
["", "ビール","beer","n",5],
["", "パン","bread","n",5],
["", "シャワー","shower","n",5],
// ===== N5 — VERBS =====
["行く","いく","to go","v",5],
["来る","くる","to come","v",5],
["帰る","かえる","to return home","v",5],
["食べる","たべる","to eat","v",5],
["飲む","のむ","to drink","v",5],
["見る","みる","to see, to watch","v",5],
["聞く","きく","to listen, to ask","v",5],
["話す","はなす","to speak, to talk","v",5],
["読む","よむ","to read","v",5],
["書く","かく","to write","v",5],
["買う","かう","to buy","v",5],
["売る","うる","to sell","v",5],
["会う","あう","to meet","v",5],
["待つ","まつ","to wait","v",5],
["立つ","たつ","to stand","v",5],
["座る","すわる","to sit","v",5],
["歩く","あるく","to walk","v",5],
["走る","はしる","to run","v",5],
["泳ぐ","およぐ","to swim","v",5],
["飛ぶ","とぶ","to fly","v",5],
["起きる","おきる","to wake up, to get up","v",5],
["寝る","ねる","to sleep, to go to bed","v",5],
["休む","やすむ","to rest, to take a day off","v",5],
["働く","はたらく","to work","v",5],
["作る","つくる","to make","v",5],
["使う","つかう","to use","v",5],
["持つ","もつ","to hold, to carry","v",5],
["取る","とる","to take","v",5],
["置く","おく","to put, to place","v",5],
["開ける","あける","to open (something)","v",5],
["閉める","しめる","to close (something)","v",5],
["入る","はいる","to enter","v",5],
["出る","でる","to exit, to leave","v",5],
["出かける","でかける","to go out","v",5],
["乗る","のる","to ride, to get on","v",5],
["降りる","おりる","to get off","v",5],
["渡る","わたる","to cross over","v",5],
["曲がる","まがる","to turn (a corner)","v",5],
["止まる","とまる","to stop (moving)","v",5],
["始まる","はじまる","to begin (intransitive)","v",5],
["終わる","おわる","to end, to finish","v",5],
["教える","おしえる","to teach, to tell","v",5],
["習う","ならう","to learn (from someone)","v",5],
["覚える","おぼえる","to memorize, to remember","v",5],
["忘れる","わすれる","to forget","v",5],
["知る","しる","to know","v",5],
["分かる","わかる","to understand","v",5],
["思う","おもう","to think","v",5],
["言う","いう","to say","v",5],
["呼ぶ","よぶ","to call, to summon","v",5],
["答える","こたえる","to answer","v",5],
["貸す","かす","to lend","v",5],
["借りる","かりる","to borrow","v",5],
["返す","かえす","to return (an item)","v",5],
["送る","おくる","to send","v",5],
["洗う","あらう","to wash","v",5],
["着る","きる","to wear (upper body)","v",5],
["脱ぐ","ぬぐ","to take off (clothes)","v",5],
["履く","はく","to wear (shoes, pants)","v",5],
["被る","かぶる","to wear (on the head)","v",5],
["切る","きる","to cut","v",5],
["並ぶ","ならぶ","to line up","v",5],
["住む","すむ","to live, to reside","v",5],
["死ぬ","しぬ","to die","v",5],
["生まれる","うまれる","to be born","v",5],
["疲れる","つかれる","to get tired","v",5],
["晴れる","はれる","to clear up (weather)","v",5],
["曇る","くもる","to become cloudy","v",5],
["降る","ふる","to fall (rain, snow)","v",5],
["吹く","ふく","to blow (wind)","v",5],
["消す","けす","to turn off, to erase","v",5],
["押す","おす","to push, to press","v",5],
["引く","ひく","to pull","v",5],
["弾く","ひく","to play (an instrument)","v",5],
["歌う","うたう","to sing","v",5],
["撮る","とる","to take (a photo)","v",5],
["遊ぶ","あそぶ","to play, to hang out","v",5],
["泣く","なく","to cry","v",5],
["笑う","わらう","to laugh, to smile","v",5],
["登る","のぼる","to climb","v",5],
// ===== N5 — ADJECTIVES =====
["大きい","おおきい","big, large","adj",5],
["小さい","ちいさい","small","adj",5],
["新しい","あたらしい","new","adj",5],
["古い","ふるい","old (things)","adj",5],
["高い","たかい","tall, expensive","adj",5],
["安い","やすい","cheap","adj",5],
["低い","ひくい","low, short (height)","adj",5],
["長い","ながい","long","adj",5],
["短い","みじかい","short (length)","adj",5],
["広い","ひろい","wide, spacious","adj",5],
["狭い","せまい","narrow, cramped","adj",5],
["早い","はやい","early","adj",5],
["速い","はやい","fast, quick","adj",5],
["遅い","おそい","late, slow","adj",5],
["近い","ちかい","near, close","adj",5],
["遠い","とおい","far, distant","adj",5],
["強い","つよい","strong","adj",5],
["弱い","よわい","weak","adj",5],
["重い","おもい","heavy","adj",5],
["軽い","かるい","light (weight)","adj",5],
["暑い","あつい","hot (weather)","adj",5],
["熱い","あつい","hot (to the touch)","adj",5],
["寒い","さむい","cold (weather)","adj",5],
["冷たい","つめたい","cold (to the touch)","adj",5],
["暖かい","あたたかい","warm","adj",5],
["涼しい","すずしい","cool (weather)","adj",5],
["明るい","あかるい","bright, cheerful","adj",5],
["暗い","くらい","dark, gloomy","adj",5],
["白い","しろい","white","adj",5],
["黒い","くろい","black","adj",5],
["赤い","あかい","red","adj",5],
["青い","あおい","blue","adj",5],
["黄色い","きいろい","yellow","adj",5],
["良い","よい","good","adj",5],
["悪い","わるい","bad","adj",5],
["忙しい","いそがしい","busy","adj",5],
["楽しい","たのしい","fun, enjoyable","adj",5],
["面白い","おもしろい","interesting, funny","adj",5],
["", "つまらない","boring, dull","adj",5],
["難しい","むずかしい","difficult","adj",5],
["易しい","やさしい","easy, simple","adj",5],
["優しい","やさしい","kind, gentle","adj",5],
["美味しい","おいしい","delicious","adj",5],
["", "まずい","bad-tasting","adj",5],
["甘い","あまい","sweet","adj",5],
["辛い","からい","spicy, hot (taste)","adj",5],
["若い","わかい","young","adj",5],
["丸い","まるい","round","adj",5],
["危ない","あぶない","dangerous","adj",5],
["汚い","きたない","dirty","adj",5],
["可愛い","かわいい","cute","adj",5],
["痛い","いたい","painful, sore","adj",5],
["元気","げんき","healthy, energetic","adj",5],
["静か","しずか","quiet","adj",5],
["賑やか","にぎやか","lively, bustling","adj",5],
["有名","ゆうめい","famous","adj",5],
["綺麗","きれい","pretty, clean","adj",5],
["親切","しんせつ","kind, helpful","adj",5],
["便利","べんり","convenient","adj",5],
["不便","ふべん","inconvenient","adj",5],
["好き","すき","liked, favorite","adj",5],
["嫌い","きらい","disliked, hated","adj",5],
["上手","じょうず","skilled, good at","adj",5],
["下手","へた","unskilled, bad at","adj",5],
["暇","ひま","free (having spare time)","adj",5],
["大丈夫","だいじょうぶ","all right, okay","adj",5],
["大変","たいへん","tough, serious, hard","adj",5],
// ===== N5 — ADVERBS =====
["", "とても","very","adv",5],
["少し","すこし","a little, a bit","adv",5],
["", "ちょっと","a little, a moment","adv",5],
["", "たくさん","a lot, many","adv",5],
["", "よく","often, well","adv",5],
["時々","ときどき","sometimes","adv",5],
["", "いつも","always","adv",5],
["全然","ぜんぜん","(not) at all","adv",5],
["", "あまり","(not) very much","adv",5],
["", "もう","already","adv",5],
["", "まだ","still, not yet","adv",5],
["", "すぐ","immediately, soon","adv",5],
["", "ゆっくり","slowly, leisurely","adv",5],
["一緒に","いっしょに","together","adv",5],
["多分","たぶん","probably, perhaps","adv",5],
["本当に","ほんとうに","really, truly","adv",5],
["", "また","again","adv",5],
["", "もっと","more","adv",5],
["初めて","はじめて","for the first time","adv",5],
["", "だんだん","gradually","adv",5],
["", "まっすぐ","straight ahead","adv",5],
// ===== N4 — NOUNS =====
["場所","ばしょ","place, location","n",4],
["地震","じしん","earthquake","n",4],
["台風","たいふう","typhoon","n",4],
["火事","かじ","fire (disaster)","n",4],
["事故","じこ","accident","n",4],
["経験","けいけん","experience","n",4],
["興味","きょうみ","interest (in something)","n",4],
["趣味","しゅみ","hobby","n",4],
["夢","ゆめ","dream","n",4],
["気分","きぶん","mood, frame of mind","n",4],
["気持ち","きもち","feeling, sensation","n",4],
["心","こころ","heart, mind","n",4],
["力","ちから","power, strength","n",4],
["音","おと","sound","n",4],
["匂い","におい","smell, scent","n",4],
["味","あじ","taste, flavor","n",4],
["形","かたち","shape, form","n",4],
["値段","ねだん","price","n",4],
["お釣り","おつり","change (money)","n",4],
["売り場","うりば","sales floor, counter","n",4],
["品物","しなもの","goods, article","n",4],
["規則","きそく","rule, regulation","n",4],
["警察","けいさつ","police","n",4],
["泥棒","どろぼう","thief, burglar","n",4],
["受付","うけつけ","reception desk","n",4],
["会議","かいぎ","meeting, conference","n",4],
["会話","かいわ","conversation","n",4],
["説明","せつめい","explanation","n",4],
["紹介","しょうかい","introduction","n",4],
["招待","しょうたい","invitation","n",4],
["約束","やくそく","promise, appointment","n",4],
["予定","よてい","plan, schedule","n",4],
["予約","よやく","reservation, booking","n",4],
["準備","じゅんび","preparation","n",4],
["用意","ようい","preparation, getting ready","n",4],
["練習","れんしゅう","practice","n",4],
["復習","ふくしゅう","review (of lessons)","n",4],
["予習","よしゅう","preparation for a lesson","n",4],
["試験","しけん","exam, test","n",4],
["成績","せいせき","grades, results","n",4],
["番組","ばんぐみ","TV program","n",4],
["放送","ほうそう","broadcast","n",4],
["小説","しょうせつ","novel","n",4],
["漫画","まんが","comic, manga","n",4],
["文化","ぶんか","culture","n",4],
["文学","ぶんがく","literature","n",4],
["歴史","れきし","history","n",4],
["地理","ちり","geography","n",4],
["科学","かがく","science","n",4],
["数学","すうがく","mathematics","n",4],
["医学","いがく","medical science","n",4],
["政治","せいじ","politics","n",4],
["経済","けいざい","economy","n",4],
["産業","さんぎょう","industry","n",4],
["貿易","ぼうえき","trade, commerce","n",4],
["輸出","ゆしゅつ","export","n",4],
["輸入","ゆにゅう","import","n",4],
["工場","こうじょう","factory","n",4],
["事務所","じむしょ","office","n",4],
["入学","にゅうがく","school admission","n",4],
["卒業","そつぎょう","graduation","n",4],
["留学生","りゅうがくせい","international student","n",4],
["先輩","せんぱい","senior (at work or school)","n",4],
["後輩","こうはい","junior (at work or school)","n",4],
["課長","かちょう","section manager","n",4],
["部長","ぶちょう","department head","n",4],
["社長","しゃちょう","company president","n",4],
["店員","てんいん","shop clerk","n",4],
["駅員","えきいん","station staff","n",4],
["看護師","かんごし","nurse","n",4],
["公務員","こうむいん","civil servant","n",4],
["運転手","うんてんしゅ","driver (occupation)","n",4],
["お客さん","おきゃくさん","customer, guest","n",4],
["隣","となり","next to, neighbor","n",4],
["近所","きんじょ","neighborhood","n",4],
["郊外","こうがい","suburbs","n",4],
["田舎","いなか","countryside","n",4],
["島","しま","island","n",4],
["湖","みずうみ","lake","n",4],
["港","みなと","harbor, port","n",4],
["空港","くうこう","airport","n",4],
["森","もり","forest","n",4],
["林","はやし","woods, grove","n",4],
["草","くさ","grass","n",4],
["葉","は","leaf","n",4],
["枝","えだ","branch","n",4],
["石","いし","stone","n",4],
["砂","すな","sand","n",4],
["星","ほし","star","n",4],
["月","つき","moon, month","n",4],
["太陽","たいよう","sun","n",4],
["地球","ちきゅう","the Earth","n",4],
["世界","せかい","world","n",4],
["戦争","せんそう","war","n",4],
["神社","じんじゃ","Shinto shrine","n",4],
["寺","てら","Buddhist temple","n",4],
["教会","きょうかい","church","n",4],
["動物園","どうぶつえん","zoo","n",4],
["美術館","びじゅつかん","art museum","n",4],
["博物館","はくぶつかん","museum","n",4],
["屋上","おくじょう","rooftop","n",4],
["地下","ちか","underground, basement","n",4],
["階段","かいだん","stairs","n",4],
["壁","かべ","wall","n",4],
["床","ゆか","floor","n",4],
["天井","てんじょう","ceiling","n",4],
["屋根","やね","roof","n",4],
["庭","にわ","garden, yard","n",4],
["押し入れ","おしいれ","closet (Japanese-style)","n",4],
["布団","ふとん","futon, bedding","n",4],
["畳","たたみ","tatami mat","n",4],
["引き出し","ひきだし","drawer","n",4],
["鏡","かがみ","mirror","n",4],
["棚","たな","shelf","n",4],
["冷蔵庫","れいぞうこ","refrigerator","n",4],
["暖房","だんぼう","heating","n",4],
["冷房","れいぼう","air conditioning (cooling)","n",4],
["", "ガス","gas","n",4],
["", "ガソリン","gasoline, petrol","n",4],
["", "ガラス","glass (material)","n",4],
["", "エスカレーター","escalator","n",4],
["髪","かみ","hair (on the head)","n",4],
["糸","いと","thread, string","n",4],
["絹","きぬ","silk","n",4],
["木綿","もめん","cotton","n",4],
["指輪","ゆびわ","ring (jewelry)","n",4],
["腕","うで","arm","n",4],
["指","ゆび","finger","n",4],
["喉","のど","throat","n",4],
["背中","せなか","back (of the body)","n",4],
["血","ち","blood","n",4],
["熱","ねつ","fever, heat","n",4],
["風邪","かぜ","a cold (illness)","n",4],
["怪我","けが","injury","n",4],
["注射","ちゅうしゃ","injection","n",4],
["入院","にゅういん","hospitalization","n",4],
["退院","たいいん","leaving hospital","n",4],
["お見舞い","おみまい","visiting a sick person","n",4],
["歯医者","はいしゃ","dentist","n",4],
["歯","は","tooth","n",4],
["理由","りゆう","reason","n",4],
["意見","いけん","opinion","n",4],
["社会","しゃかい","society","n",4],
["運動","うんどう","exercise, sport","n",4],
["注意","ちゅうい","caution, attention","n",4],
["心配","しんぱい","worry, concern","n",4],
["失敗","しっぱい","failure, mistake","n",4],
["連絡","れんらく","contact, getting in touch","n",4],
["相談","そうだん","consultation, discussion","n",4],
["嘘","うそ","lie, falsehood","n",4],
["挨拶","あいさつ","greeting","n",4],
["習慣","しゅうかん","habit, custom","n",4],
["景色","けしき","scenery, view","n",4],
["半分","はんぶん","half","n",4],
["周り","まわり","surroundings","n",4],
["種類","しゅるい","type, kind","n",4],
["最初","さいしょ","beginning, first","n",4],
["最後","さいご","last, end","n",4],
["途中","とちゅう","on the way, midway","n",4],
["時代","じだい","era, period","n",4],
["最近","さいきん","recently, lately","n",4],
["将来","しょうらい","future (one's own)","n",4],
["昔","むかし","old days, long ago","n",4],
["結婚","けっこん","marriage","n",4],
["離婚","りこん","divorce","n",4],
["案内","あんない","guidance, showing around","n",4],
["お土産","おみやげ","souvenir","n",4],
["お祭り","おまつり","festival","n",4],
["人形","にんぎょう","doll","n",4],
["玩具","おもちゃ","toy","n",4],
["人口","じんこう","population","n",4],
["国際","こくさい","international","n",4],
["都合","つごう","convenience, circumstances","n",4],
["具合","ぐあい","condition, state (health)","n",4],
["気","き","spirit, mind, mood","n",4],
// ===== N4 — VERBS =====
["上げる","あげる","to raise, to lift","v",4],
["下げる","さげる","to lower","v",4],
["集める","あつめる","to collect, to gather (transitive)","v",4],
["集まる","あつまる","to gather (intransitive)","v",4],
["決める","きめる","to decide","v",4],
["決まる","きまる","to be decided","v",4],
["変える","かえる","to change (something)","v",4],
["変わる","かわる","to change (by itself)","v",4],
["続ける","つづける","to continue (something)","v",4],
["続く","つづく","to continue (by itself)","v",4],
["始める","はじめる","to begin (something)","v",4],
["止める","やめる","to quit, to stop doing","v",4],
["見つける","みつける","to find","v",4],
["見つかる","みつかる","to be found","v",4],
["探す","さがす","to search for","v",4],
["調べる","しらべる","to investigate, to look up","v",4],
["比べる","くらべる","to compare","v",4],
["考える","かんがえる","to think about, to consider","v",4],
["伝える","つたえる","to convey, to tell","v",4],
["届ける","とどける","to deliver","v",4],
["届く","とどく","to arrive, to reach","v",4],
["運ぶ","はこぶ","to carry, to transport","v",4],
["動く","うごく","to move","v",4],
["急ぐ","いそぐ","to hurry","v",4],
["間に合う","まにあう","to be on time, to make it","v",4],
["遅れる","おくれる","to be late","v",4],
["通う","かよう","to commute","v",4],
["寄る","よる","to drop by, to stop in","v",4],
["渡す","わたす","to hand over","v",4],
["受ける","うける","to receive, to take (an exam)","v",4],
["落ちる","おちる","to fall, to drop (intransitive)","v",4],
["落とす","おとす","to drop (something)","v",4],
["壊れる","こわれる","to break (by itself)","v",4],
["壊す","こわす","to break (something)","v",4],
["直る","なおる","to be repaired","v",4],
["直す","なおす","to fix, to repair","v",4],
["治る","なおる","to recover, to heal","v",4],
["倒れる","たおれる","to fall over, to collapse","v",4],
["折れる","おれる","to snap, to break (intransitive)","v",4],
["折る","おる","to fold, to snap (something)","v",4],
["割れる","われる","to shatter, to crack","v",4],
["割る","わる","to split, to break (something)","v",4],
["汚れる","よごれる","to get dirty","v",4],
["濡れる","ぬれる","to get wet","v",4],
["乾く","かわく","to dry","v",4],
["焼く","やく","to grill, to bake","v",4],
["焼ける","やける","to be grilled, to be burnt","v",4],
["煮る","にる","to boil, to simmer","v",4],
["沸く","わく","to boil (water)","v",4],
["冷える","ひえる","to get cold, to chill","v",4],
["温める","あたためる","to warm up (something)","v",4],
["片付ける","かたづける","to tidy up","v",4],
["捨てる","すてる","to throw away","v",4],
["拾う","ひろう","to pick up","v",4],
["植える","うえる","to plant","v",4],
["育てる","そだてる","to raise, to bring up","v",4],
["釣る","つる","to fish, to catch (fish)","v",4],
["触る","さわる","to touch","v",4],
["引っ越す","ひっこす","to move house","v",4],
["泊まる","とまる","to stay overnight","v",4],
["迎える","むかえる","to welcome, to go to meet","v",4],
["頼む","たのむ","to request, to ask a favor","v",4],
["謝る","あやまる","to apologize","v",4],
["褒める","ほめる","to praise","v",4],
["叱る","しかる","to scold","v",4],
["怒る","おこる","to get angry","v",4],
["驚く","おどろく","to be surprised","v",4],
["喜ぶ","よろこぶ","to be delighted","v",4],
["困る","こまる","to be troubled","v",4],
["慣れる","なれる","to get used to","v",4],
["太る","ふとる","to gain weight","v",4],
["痩せる","やせる","to lose weight","v",4],
["育つ","そだつ","to grow up","v",4],
["増える","ふえる","to increase","v",4],
["減る","へる","to decrease","v",4],
["上がる","あがる","to rise, to go up","v",4],
["下がる","さがる","to fall, to go down","v",4],
["進む","すすむ","to advance, to progress","v",4],
["戻る","もどる","to return, to go back","v",4],
["過ぎる","すぎる","to pass, to exceed","v",4],
["通る","とおる","to pass through","v",4],
["着く","つく","to arrive","v",4],
["連れる","つれる","to take along (a person)","v",4],
["別れる","わかれる","to part, to break up","v",4],
["残る","のこる","to remain","v",4],
["足りる","たりる","to be enough","v",4],
["払う","はらう","to pay","v",4],
["盗む","ぬすむ","to steal","v",4],
["無くす","なくす","to lose (something)","v",4],
["無くなる","なくなる","to disappear, to run out","v",4],
["生きる","いきる","to live, to be alive","v",4],
["投げる","なげる","to throw","v",4],
["逃げる","にげる","to escape, to run away","v",4],
["混む","こむ","to be crowded","v",4],
["空く","あく","to become empty, to open up","v",4],
["飾る","かざる","to decorate","v",4],
["包む","つつむ","to wrap","v",4],
["消える","きえる","to disappear, to go out","v",4],
["光る","ひかる","to shine, to glow","v",4],
["鳴る","なる","to ring, to sound","v",4],
["揺れる","ゆれる","to shake, to sway","v",4],
["転ぶ","ころぶ","to fall down, to trip","v",4],
["騒ぐ","さわぐ","to make noise","v",4],
["眠る","ねむる","to sleep","v",4],
["訪ねる","たずねる","to visit","v",4],
["助ける","たすける","to help, to rescue","v",4],
["似る","にる","to resemble","v",4],
["踊る","おどる","to dance","v",4],
// ===== N4 — ADJECTIVES =====
["嬉しい","うれしい","glad, happy","adj",4],
["悲しい","かなしい","sad","adj",4],
["寂しい","さびしい","lonely","adj",4],
["恥ずかしい","はずかしい","embarrassed, ashamed","adj",4],
["怖い","こわい","scary, frightening","adj",4],
["眠い","ねむい","sleepy","adj",4],
["苦い","にがい","bitter","adj",4],
["固い","かたい","hard, stiff","adj",4],
["柔らかい","やわらかい","soft","adj",4],
["深い","ふかい","deep","adj",4],
["浅い","あさい","shallow","adj",4],
["太い","ふとい","thick, fat","adj",4],
["細い","ほそい","thin, slender","adj",4],
["厚い","あつい","thick (flat objects)","adj",4],
["薄い","うすい","thin, weak (flavor)","adj",4],
["美しい","うつくしい","beautiful","adj",4],
["正しい","ただしい","correct, right","adj",4],
["珍しい","めずらしい","rare, unusual","adj",4],
["素晴らしい","すばらしい","wonderful, splendid","adj",4],
["酷い","ひどい","terrible, cruel","adj",4],
["厳しい","きびしい","strict, severe","adj",4],
["細かい","こまかい","fine, detailed","adj",4],
["危険","きけん","dangerous","adj",4],
["安全","あんぜん","safe","adj",4],
["自由","じゆう","free, unrestricted","adj",4],
["必要","ひつよう","necessary","adj",4],
["大切","たいせつ","precious, important","adj",4],
["大事","だいじ","important, valuable","adj",4],
["特別","とくべつ","special","adj",4],
["簡単","かんたん","simple, easy","adj",4],
["複雑","ふくざつ","complicated","adj",4],
["熱心","ねっしん","enthusiastic, eager","adj",4],
["真面目","まじめ","serious, diligent","adj",4],
["丁寧","ていねい","polite, careful","adj",4],
["適当","てきとう","suitable; half-hearted","adj",4],
["十分","じゅうぶん","enough, sufficient","adj",4],
["残念","ざんねん","regrettable, a pity","adj",4],
["失礼","しつれい","rude, impolite","adj",4],
["変","へん","strange, odd","adj",4],
["無理","むり","impossible, unreasonable","adj",4],
["駄目","だめ","no good, useless","adj",4],
["楽","らく","easy, comfortable","adj",4],
["盛ん","さかん","flourishing, popular","adj",4],
["立派","りっぱ","splendid, admirable","adj",4],
["", "すごい","amazing, incredible","adj",4],
// ===== N4 — ADVERBS =====
["必ず","かならず","certainly, without fail","adv",4],
["", "きっと","surely","adv",4],
["", "ぜひ","by all means, definitely","adv",4],
["", "やっぱり","as expected, after all","adv",4],
["特に","とくに","especially","adv",4],
["別に","べつに","(not) particularly","adv",4],
["急に","きゅうに","suddenly","adv",4],
["", "そろそろ","soon, it is about time","adv",4],
["", "なかなか","quite; (not) easily","adv",4],
["", "ほとんど","almost, mostly","adv",4],
["", "しっかり","firmly, properly","adv",4],
["", "はっきり","clearly, distinctly","adv",4],
["", "ちゃんと","properly, exactly","adv",4],
["", "どんどん","rapidly, steadily","adv",4],
["随分","ずいぶん","very, considerably","adv",4],
["結構","けっこう","quite, fairly","adv",4],
["例えば","たとえば","for example","adv",4],
["", "しばらく","for a while","adv",4],
["", "ずっと","the whole time, by far","adv",4],
["偶に","たまに","occasionally","adv",4],
["", "もちろん","of course","adv",4],
["先ず","まず","first of all","adv",4],
["", "やはり","as expected","adv",4],
["", "なるべく","as much as possible","adv",4],
["", "できるだけ","as much as one can","adv",4],
// ===== N3 — NOUNS =====
["関係","かんけい","relationship, connection","n",3],
["影響","えいきょう","influence, effect","n",3],
["原因","げんいん","cause","n",3],
["結果","けっか","result, outcome","n",3],
["目的","もくてき","purpose, goal","n",3],
["方法","ほうほう","method, way","n",3],
["手段","しゅだん","means, measure","n",3],
["状態","じょうたい","condition, state","n",3],
["状況","じょうきょう","situation, circumstances","n",3],
["場合","ばあい","case, situation","n",3],
["条件","じょうけん","condition, requirement","n",3],
["環境","かんきょう","environment","n",3],
["政府","せいふ","government","n",3],
["情報","じょうほう","information","n",3],
["知識","ちしき","knowledge","n",3],
["技術","ぎじゅつ","technology, skill","n",3],
["能力","のうりょく","ability, capacity","n",3],
["才能","さいのう","talent","n",3],
["性格","せいかく","personality, character","n",3],
["性質","せいしつ","nature, property","n",3],
["特徴","とくちょう","characteristic, feature","n",3],
["印象","いんしょう","impression","n",3],
["意識","いしき","consciousness, awareness","n",3],
["記憶","きおく","memory, recollection","n",3],
["想像","そうぞう","imagination","n",3],
["表現","ひょうげん","expression (of ideas)","n",3],
["表情","ひょうじょう","facial expression","n",3],
["態度","たいど","attitude","n",3],
["行動","こうどう","action, behavior","n",3],
["活動","かつどう","activity","n",3],
["努力","どりょく","effort","n",3],
["我慢","がまん","patience, endurance","n",3],
["注目","ちゅうもく","attention, notice","n",3],
["期待","きたい","expectation, hope","n",3],
["希望","きぼう","hope, wish","n",3],
["不安","ふあん","anxiety, unease","n",3],
["感情","かんじょう","emotion, feelings","n",3],
["感覚","かんかく","sense, sensation","n",3],
["感想","かんそう","impressions, thoughts","n",3],
["感謝","かんしゃ","gratitude, thanks","n",3],
["成功","せいこう","success","n",3],
["成長","せいちょう","growth","n",3],
["発展","はってん","development, expansion","n",3],
["進歩","しんぽ","progress, advancement","n",3],
["変化","へんか","change, transformation","n",3],
["増加","ぞうか","increase, growth in number","n",3],
["減少","げんしょう","decrease, decline","n",3],
["比較","ひかく","comparison","n",3],
["差","さ","difference, gap","n",3],
["違い","ちがい","difference, distinction","n",3],
["共通","きょうつう","commonness, shared trait","n",3],
["個人","こじん","individual","n",3],
["集団","しゅうだん","group, collective","n",3],
["組織","そしき","organization","n",3],
["制度","せいど","system, institution","n",3],
["制限","せいげん","restriction, limit","n",3],
["禁止","きんし","prohibition, ban","n",3],
["許可","きょか","permission","n",3],
["命令","めいれい","order, command","n",3],
["要求","ようきゅう","demand, request","n",3],
["提案","ていあん","proposal, suggestion","n",3],
["報告","ほうこく","report","n",3],
["議論","ぎろん","debate, argument","n",3],
["解決","かいけつ","solution, settlement","n",3],
["判断","はんだん","judgment, decision","n",3],
["決定","けってい","decision, determination","n",3],
["選択","せんたく","choice, selection","n",3],
["選挙","せんきょ","election","n",3],
["投票","とうひょう","voting, ballot","n",3],
["税金","ぜいきん","tax","n",3],
["給料","きゅうりょう","salary, wages","n",3],
["収入","しゅうにゅう","income","n",3],
["費用","ひよう","expense, cost","n",3],
["料金","りょうきん","fee, charge","n",3],
["借金","しゃっきん","debt","n",3],
["貯金","ちょきん","savings","n",3],
["商品","しょうひん","product, merchandise","n",3],
["製品","せいひん","manufactured goods","n",3],
["商売","しょうばい","business, trade","n",3],
["経営","けいえい","management (of a business)","n",3],
["募集","ぼしゅう","recruitment","n",3],
["面接","めんせつ","interview (job)","n",3],
["履歴書","りれきしょ","resume, CV","n",3],
["残業","ざんぎょう","overtime work","n",3],
["出張","しゅっちょう","business trip","n",3],
["退職","たいしょく","retirement, resignation","n",3],
["職業","しょくぎょう","occupation, profession","n",3],
["役割","やくわり","role, part","n",3],
["担当","たんとう","being in charge","n",3],
["責任","せきにん","responsibility","n",3],
["義務","ぎむ","duty, obligation","n",3],
["権利","けんり","right (entitlement)","n",3],
["自然","しぜん","nature (natural world)","n",3],
["資源","しげん","resources","n",3],
["石油","せきゆ","oil, petroleum","n",3],
["公害","こうがい","pollution","n",3],
["災害","さいがい","disaster","n",3],
["被害","ひがい","damage, harm","n",3],
["事件","じけん","incident, case","n",3],
["犯罪","はんざい","crime","n",3],
["犯人","はんにん","criminal, culprit","n",3],
["裁判","さいばん","trial, lawsuit","n",3],
["証拠","しょうこ","evidence, proof","n",3],
["秘密","ひみつ","secret","n",3],
["冗談","じょうだん","joke","n",3],
["噂","うわさ","rumor, gossip","n",3],
["遠慮","えんりょ","restraint, holding back","n",3],
["常識","じょうしき","common sense","n",3],
["伝統","でんとう","tradition","n",3],
["宗教","しゅうきょう","religion","n",3],
["芸術","げいじゅつ","art, the arts","n",3],
["演奏","えんそう","musical performance","n",3],
["観客","かんきゃく","audience, spectators","n",3],
["観光","かんこう","sightseeing, tourism","n",3],
["風景","ふうけい","landscape, scene","n",3],
["距離","きょり","distance","n",3],
["速度","そくど","speed, velocity","n",3],
["温度","おんど","temperature","n",3],
["気温","きおん","air temperature","n",3],
["平均","へいきん","average","n",3],
["割合","わりあい","ratio, proportion","n",3],
["倍","ばい","times, double","n",3],
["全体","ぜんたい","the whole, entirety","n",3],
["部分","ぶぶん","part, portion","n",3],
["中心","ちゅうしん","center, core","n",3],
["表面","ひょうめん","surface","n",3],
["内容","ないよう","contents, substance","n",3],
["方向","ほうこう","direction","n",3],
["順番","じゅんばん","turn, order","n",3],
["列","れつ","row, line, queue","n",3],
["締め切り","しめきり","deadline","n",3],
["期間","きかん","period, term","n",3],
["期限","きげん","time limit, deadline date","n",3],
["最中","さいちゅう","in the middle of","n",3],
["当日","とうじつ","the day in question","n",3],
["翌日","よくじつ","the next day","n",3],
["過去","かこ","the past","n",3],
["現在","げんざい","the present, currently","n",3],
["未来","みらい","the future","n",3],
["現代","げんだい","modern times","n",3],
["世紀","せいき","century","n",3],
["瞬間","しゅんかん","moment, instant","n",3],
["平和","へいわ","peace","n",3],
["都会","とかい","big city","n",3],
["法律","ほうりつ","law","n",3],
["命","いのち","life","n",3],
["涙","なみだ","tears","n",3],
["息","いき","breath","n",3],
["汗","あせ","sweat","n",3],
["骨","ほね","bone","n",3],
["皮膚","ひふ","skin","n",3],
["筋肉","きんにく","muscle","n",3],
["腰","こし","lower back, waist","n",3],
["肩","かた","shoulder","n",3],
["膝","ひざ","knee","n",3],
// ===== N3 — VERBS =====
["認める","みとめる","to admit, to recognize","v",3],
["求める","もとめる","to seek, to request","v",3],
["与える","あたえる","to give, to grant","v",3],
["得る","える","to gain, to obtain","v",3],
["失う","うしなう","to lose (something important)","v",3],
["守る","まもる","to protect, to keep (a promise)","v",3],
["防ぐ","ふせぐ","to prevent, to defend against","v",3],
["救う","すくう","to save, to rescue","v",3],
["支える","ささえる","to support, to hold up","v",3],
["頼る","たよる","to rely on","v",3],
["任せる","まかせる","to entrust, to leave to","v",3],
["預ける","あずける","to deposit, to leave in care","v",3],
["預かる","あずかる","to look after, to keep","v",3],
["確かめる","たしかめる","to confirm, to verify","v",3],
["試す","ためす","to try out, to test","v",3],
["諦める","あきらめる","to give up","v",3],
["繰り返す","くりかえす","to repeat","v",3],
["重ねる","かさねる","to pile up, to repeat","v",3],
["加える","くわえる","to add","v",3],
["含む","ふくむ","to include, to contain","v",3],
["除く","のぞく","to exclude, to remove","v",3],
["限る","かぎる","to limit, to restrict","v",3],
["超える","こえる","to exceed, to go beyond","v",3],
["向かう","むかう","to head toward, to face","v",3],
["追う","おう","to chase, to pursue","v",3],
["追いつく","おいつく","to catch up with","v",3],
["隠す","かくす","to hide (something)","v",3],
["隠れる","かくれる","to hide (oneself)","v",3],
["現れる","あらわれる","to appear, to emerge","v",3],
["表す","あらわす","to express, to represent","v",3],
["示す","しめす","to show, to indicate","v",3],
["指す","さす","to point at","v",3],
["述べる","のべる","to state, to mention","v",3],
["語る","かたる","to tell, to narrate","v",3],
["黙る","だまる","to be silent","v",3],
["叫ぶ","さけぶ","to shout, to scream","v",3],
["怒鳴る","どなる","to yell at","v",3],
["殴る","なぐる","to punch","v",3],
["蹴る","ける","to kick","v",3],
["叩く","たたく","to hit, to knock","v",3],
["触れる","ふれる","to touch lightly, to mention","v",3],
["抱く","だく","to hold in arms, to embrace","v",3],
["握る","にぎる","to grip, to clasp","v",3],
["掴む","つかむ","to grab, to seize","v",3],
["放す","はなす","to release, to let go","v",3],
["受け取る","うけとる","to receive, to accept","v",3],
["配る","くばる","to distribute, to hand out","v",3],
["注ぐ","そそぐ","to pour into","v",3],
["混ぜる","まぜる","to mix, to stir","v",3],
["埋める","うめる","to bury, to fill in","v",3],
["掘る","ほる","to dig","v",3],
["積む","つむ","to pile up, to load","v",3],
["載せる","のせる","to place on, to publish","v",3],
["結ぶ","むすぶ","to tie, to link","v",3],
["解く","とく","to solve, to untie","v",3],
["破る","やぶる","to tear, to break (a rule)","v",3],
["破れる","やぶれる","to be torn","v",3],
["曲げる","まげる","to bend (something)","v",3],
["伸びる","のびる","to stretch, to grow longer","v",3],
["伸ばす","のばす","to extend, to grow (hair)","v",3],
["縮む","ちぢむ","to shrink","v",3],
["広がる","ひろがる","to spread out (intransitive)","v",3],
["広げる","ひろげる","to spread, to widen (something)","v",3],
["流れる","ながれる","to flow","v",3],
["流す","ながす","to pour, to flush, to set adrift","v",3],
["浮かぶ","うかぶ","to float, to come to mind","v",3],
["沈む","しずむ","to sink","v",3],
["燃える","もえる","to burn (intransitive)","v",3],
["燃やす","もやす","to burn (something)","v",3],
["輝く","かがやく","to shine, to sparkle","v",3],
["響く","ひびく","to echo, to resound","v",3],
["震える","ふるえる","to tremble, to shiver","v",3],
["滑る","すべる","to slip, to slide","v",3],
["経つ","たつ","to pass (of time)","v",3],
["過ごす","すごす","to spend (time)","v",3],
["暮らす","くらす","to live, to get along","v",3],
["稼ぐ","かせぐ","to earn (money)","v",3],
["雇う","やとう","to hire, to employ","v",3],
["勤める","つとめる","to work for (a company)","v",3],
["進める","すすめる","to advance, to move forward (something)","v",3],
["勧める","すすめる","to recommend","v",3],
["誘う","さそう","to invite, to ask out","v",3],
["断る","ことわる","to refuse, to decline","v",3],
["申し込む","もうしこむ","to apply for","v",3],
["許す","ゆるす","to forgive, to permit","v",3],
["責める","せめる","to blame, to criticize","v",3],
["疑う","うたがう","to doubt, to suspect","v",3],
["信じる","しんじる","to believe","v",3],
["感じる","かんじる","to feel","v",3],
["悩む","なやむ","to worry, to agonize","v",3],
["迷う","まよう","to get lost, to hesitate","v",3],
["慌てる","あわてる","to panic, to rush","v",3],
["落ち着く","おちつく","to calm down, to settle","v",3],
["飽きる","あきる","to get tired of","v",3],
["憧れる","あこがれる","to long for, to admire","v",3],
["望む","のぞむ","to wish for, to desire","v",3],
["願う","ねがう","to wish, to pray for","v",3],
["祈る","いのる","to pray","v",3],
["祝う","いわう","to celebrate","v",3],
["招く","まねく","to invite, to bring about","v",3],
["訪れる","おとずれる","to visit, to come (of seasons)","v",3],
["出会う","であう","to encounter, to meet by chance","v",3],
["付き合う","つきあう","to date, to keep company with","v",3],
["似合う","にあう","to suit, to look good on","v",3],
["産む","うむ","to give birth","v",3],
["喋る","しゃべる","to chat, to talk","v",3],
["酔う","よう","to get drunk","v",3],
["離れる","はなれる","to separate, to move away","v",3],
["余る","あまる","to remain, to be left over","v",3],
["残す","のこす","to leave behind","v",3],
["戻す","もどす","to put back, to return (something)","v",3],
["見送る","みおくる","to see someone off","v",3],
["生える","はえる","to grow (of plants, hair)","v",3],
["枯れる","かれる","to wither","v",3],
["香る","かおる","to smell good, to be fragrant","v",3],
// ===== N3 — ADJECTIVES =====
["偉い","えらい","great, admirable","adj",3],
["賢い","かしこい","wise, clever","adj",3],
["鋭い","するどい","sharp, keen","adj",3],
["鈍い","にぶい","dull, slow","adj",3],
["激しい","はげしい","intense, violent","adj",3],
["穏やか","おだやか","calm, gentle","adj",3],
["豊か","ゆたか","abundant, wealthy","adj",3],
["貧しい","まずしい","poor, needy","adj",3],
["幼い","おさない","very young, childish","adj",3],
["大人しい","おとなしい","quiet, well-behaved","adj",3],
["親しい","したしい","close, intimate (friend)","adj",3],
["懐かしい","なつかしい","nostalgic, fondly remembered","adj",3],
["恋しい","こいしい","missed, longed for","adj",3],
["羨ましい","うらやましい","envious, enviable","adj",3],
["悔しい","くやしい","frustrating, vexing","adj",3],
["恐ろしい","おそろしい","dreadful, terrifying","adj",3],
["詳しい","くわしい","detailed, knowledgeable","adj",3],
["等しい","ひとしい","equal, equivalent","adj",3],
["怪しい","あやしい","suspicious, dubious","adj",3],
["眩しい","まぶしい","dazzling, blinding","adj",3],
["緩い","ゆるい","loose, lenient","adj",3],
["", "きつい","tight, harsh, demanding","adj",3],
["荒い","あらい","rough, wild","adj",3],
["濃い","こい","thick (liquid), strong (flavor)","adj",3],
["苦しい","くるしい","painful, agonizing","adj",3],
["酸っぱい","すっぱい","sour","adj",3],
["主な","おもな","main, principal","adj",3],
["重要","じゅうよう","important, significant","adj",3],
["必死","ひっし","desperate, frantic","adj",3],
["正直","しょうじき","honest, frank","adj",3],
["素直","すなお","obedient, straightforward","adj",3],
["真剣","しんけん","serious, earnest","adj",3],
["慎重","しんちょう","cautious, careful","adj",3],
["積極的","せっきょくてき","proactive, positive","adj",3],
["消極的","しょうきょくてき","passive, reserved","adj",3],
["具体的","ぐたいてき","concrete, specific","adj",3],
["基本的","きほんてき","basic, fundamental","adj",3],
["一般的","いっぱんてき","general, typical","adj",3],
["完全","かんぜん","complete, perfect (whole)","adj",3],
["完璧","かんぺき","flawless, perfect","adj",3],
["当然","とうぜん","natural, to be expected","adj",3],
["新鮮","しんせん","fresh","adj",3],
["豪華","ごうか","luxurious, gorgeous","adj",3],
["地味","じみ","plain, subdued","adj",3],
["派手","はで","flashy, showy","adj",3],
["確か","たしか","certain, sure","adj",3],
["確実","かくじつ","reliable, definite","adj",3],
["急","きゅう","sudden, urgent","adj",3],
["面倒","めんどう","troublesome, a hassle","adj",3],
["退屈","たいくつ","boring, tedious","adj",3],
["夢中","むちゅう","absorbed in, crazy about","adj",3],
["得意","とくい","good at, one's forte","adj",3],
["苦手","にがて","bad at, weak point","adj",3],
["平気","へいき","unfazed, indifferent","adj",3],
["無駄","むだ","wasteful, futile","adj",3],
["巨大","きょだい","huge, gigantic","adj",3],
["微妙","びみょう","subtle, delicate, iffy","adj",3],
["明らか","あきらか","obvious, clear","adj",3],
["爽やか","さわやか","refreshing, fresh","adj",3],
["不思議","ふしぎ","mysterious, strange","adj",3],
["可能","かのう","possible","adj",3],
["不可能","ふかのう","impossible","adj",3],
["単純","たんじゅん","simple, simple-minded","adj",3],
["乱暴","らんぼう","violent, rough","adj",3],
// ===== N3 — ADVERBS =====
["全く","まったく","entirely, completely","adv",3],
["既に","すでに","already, previously","adv",3],
["相変わらず","あいかわらず","as usual, as ever","adv",3],
["偶然","ぐうぜん","by chance, coincidentally","adv",3],
["突然","とつぜん","suddenly, abruptly","adv",3],
["案外","あんがい","unexpectedly","adv",3],
["意外と","いがいと","surprisingly","adv",3],
["", "さすが","as expected (impressed)","adv",3],
["", "わざと","on purpose, deliberately","adv",3],
["", "わざわざ","going out of the way to","adv",3],
["", "うっかり","carelessly, absent-mindedly","adv",3],
["", "ぐっすり","(sleeping) soundly","adv",3],
["", "のんびり","leisurely, at ease","adv",3],
["", "こっそり","secretly, stealthily","adv",3],
["早速","さっそく","right away, promptly","adv",3],
["直ちに","ただちに","at once, immediately","adv",3],
["一気に","いっきに","in one go, all at once","adv",3],
["次々に","つぎつぎに","one after another","adv",3],
["徐々に","じょじょに","gradually, little by little","adv",3],
["", "ますます","increasingly, more and more","adv",3],
["更に","さらに","furthermore, even more","adv",3],
["再び","ふたたび","again, once more","adv",3],
["常に","つねに","always, constantly","adv",3],
["滅多に","めったに","rarely, seldom","adv",3],
["", "やがて","before long, eventually","adv",3],
["", "いずれ","sooner or later","adv",3],
["結局","けっきょく","in the end, after all","adv",3],
["", "つまり","in other words, that is","adv",3],
["主に","おもに","mainly, primarily","adv",3],
["単に","たんに","simply, merely","adv",3],
["実は","じつは","actually, to tell the truth","adv",3],
["実際に","じっさいに","in reality, in practice","adv",3],
["確かに","たしかに","certainly, indeed","adv",3],
["絶対に","ぜったいに","absolutely, definitely","adv",3],
["必ずしも","かならずしも","not necessarily","adv",3],
["思わず","おもわず","unintentionally, instinctively","adv",3],
["互いに","たがいに","mutually, with each other","adv",3],
["別々に","べつべつに","separately","adv",3],
["同時に","どうじに","simultaneously, at the same time","adv",3],
["", "ついに","finally, at last","adv",3],
["", "しばしば","often, frequently","adv",3],
["", "じっと","fixedly, motionlessly","adv",3],
// ===== N5 — EXPANSION: pronouns, question words, expressions (pos x) =====
["", "これ","this (thing)","x",5],
["", "それ","that (thing)","x",5],
["", "あれ","that (thing over there)","x",5],
["", "どれ","which (thing)","x",5],
["", "ここ","here","x",5],
["", "そこ","there","x",5],
["", "あそこ","over there","x",5],
["", "どこ","where","x",5],
["", "こちら","this way, this one (polite)","x",5],
["", "そちら","that way, that one (polite)","x",5],
["", "あちら","over that way (polite)","x",5],
["", "どちら","which way, which one (polite)","x",5],
["誰","だれ","who","x",5],
["", "どなた","who (polite)","x",5],
["何","なに","what","x",5],
["", "いつ","when","x",5],
["", "どう","how, in what way","x",5],
["", "どうして","why, for what reason","x",5],
["", "なぜ","why","x",5],
["", "いくら","how much (price)","x",5],
["", "いくつ","how many, how old","x",5],
["", "あなた","you","x",5],
["", "そして","and, and then","x",5],
["", "それから","after that, and then","x",5],
["", "でも","but, however","x",5],
["", "だから","so, therefore","x",5],
["", "おはようございます","good morning","x",5],
["", "こんにちは","hello, good afternoon","x",5],
["", "こんばんは","good evening","x",5],
["", "おやすみなさい","good night","x",5],
["", "ありがとう","thank you","x",5],
["", "すみません","excuse me, sorry","x",5],
["", "ごめんなさい","I am sorry","x",5],
["", "いただきます","said before eating","x",5],
["", "ごちそうさま","said after eating","x",5],
["", "ただいま","I am home","x",5],
["", "おかえりなさい","welcome home","x",5],
["", "いってきます","I am off (leaving home)","x",5],
["", "いってらっしゃい","take care (to someone leaving)","x",5],
["", "はじめまして","nice to meet you","x",5],
["", "よろしくお願いします","please treat me well","x",5],
["", "どういたしまして","you are welcome","x",5],
["", "もしもし","hello (on the phone)","x",5],
["", "さようなら","goodbye","x",5],
["", "どうぞ","please, go ahead","x",5],
["", "どうも","thanks, somehow","x",5],
// ===== N5 — EXPANSION: nouns =====
["月曜日","げつようび","Monday","n",5],
["火曜日","かようび","Tuesday","n",5],
["水曜日","すいようび","Wednesday","n",5],
["木曜日","もくようび","Thursday","n",5],
["金曜日","きんようび","Friday","n",5],
["土曜日","どようび","Saturday","n",5],
["日曜日","にちようび","Sunday","n",5],
["今朝","けさ","this morning","n",5],
["今晩","こんばん","this evening","n",5],
["夕方","ゆうがた","early evening","n",5],
["夕べ","ゆうべ","last night","n",5],
["午前","ごぜん","a.m., morning","n",5],
["午後","ごご","p.m., afternoon","n",5],
["半","はん","half (past the hour)","n",5],
["毎週","まいしゅう","every week","n",5],
["毎年","まいとし","every year","n",5],
["大人","おとな","adult","n",5],
["男の子","おとこのこ","boy","n",5],
["女の子","おんなのこ","girl","n",5],
["両親","りょうしん","parents","n",5],
["兄弟","きょうだい","siblings","n",5],
["お父さん","おとうさん","father (polite)","n",5],
["お母さん","おかあさん","mother (polite)","n",5],
["お兄さん","おにいさん","older brother (polite)","n",5],
["お姉さん","おねえさん","older sister (polite)","n",5],
["", "おじいさん","grandfather, elderly man","n",5],
["", "おばあさん","grandmother, elderly woman","n",5],
["", "おじさん","uncle, middle-aged man","n",5],
["", "おばさん","aunt, middle-aged woman","n",5],
["奥さん","おくさん","(someone's) wife","n",5],
["ご主人","ごしゅじん","(someone's) husband","n",5],
["皆さん","みなさん","everyone (polite)","n",5],
["", "みんな","everyone, everybody","n",5],
["建物","たてもの","building","n",5],
["映画館","えいがかん","movie theater","n",5],
["大使館","たいしかん","embassy","n",5],
["教室","きょうしつ","classroom","n",5],
["授業","じゅぎょう","class, lesson","n",5],
["作文","さくぶん","composition, essay","n",5],
["意味","いみ","meaning","n",5],
["漢字","かんじ","kanji, Chinese character","n",5],
["平仮名","ひらがな","hiragana","n",5],
["片仮名","かたかな","katakana","n",5],
["字","じ","character, handwriting","n",5],
["番号","ばんごう","number (assigned)","n",5],
["鉛筆","えんぴつ","pencil","n",5],
["", "ペン","pen","n",5],
["", "ノート","notebook","n",5],
["", "ページ","page","n",5],
["", "テスト","test","n",5],
["", "クラス","class (group)","n",5],
["池","いけ","pond","n",5],
["石鹸","せっけん","soap","n",5],
["荷物","にもつ","luggage, baggage","n",5],
["自動車","じどうしゃ","automobile","n",5],
["警官","けいかん","police officer","n",5],
["背","せ","height, stature","n",5],
["飴","あめ","candy","n",5],
["お菓子","おかし","sweets, snacks","n",5],
["お手洗い","おてあらい","restroom","n",5],
["角","かど","corner (street)","n",5],
["花瓶","かびん","vase","n",5],
["灰皿","はいざら","ashtray","n",5],
["", "ストーブ","heater, stove","n",5],
["", "ポスト","postbox, mailbox","n",5],
["", "タクシー","taxi","n",5],
["", "バス","bus","n",5],
["動物","どうぶつ","animal","n",5],
["お腹","おなか","stomach, belly","n",5],
["八百屋","やおや","greengrocer","n",5],
["出口","でぐち","exit","n",5],
["入口","いりぐち","entrance","n",5],
["横","よこ","beside, side","n",5],
["前","まえ","front, before","n",5],
["後ろ","うしろ","behind, back","n",5],
["上","うえ","above, on top","n",5],
["下","した","below, under","n",5],
["中","なか","inside, middle","n",5],
["外","そと","outside","n",5],
["右","みぎ","right (direction)","n",5],
["左","ひだり","left (direction)","n",5],
["間","あいだ","between, interval","n",5],
["側","そば","near, beside","n",5],
["東","ひがし","east","n",5],
["西","にし","west","n",5],
["南","みなみ","south","n",5],
["北","きた","north","n",5],
// ===== N5 — EXPANSION: verbs =====
["", "する","to do","v",5],
["", "ある","to exist, to have (inanimate)","v",5],
["", "いる","to exist, to be (animate)","v",5],
["", "なる","to become","v",5],
["出す","だす","to take out, to submit","v",5],
["入れる","いれる","to put in","v",5],
["", "つける","to turn on, to attach","v",5],
["浴びる","あびる","to take (a shower), to bathe in","v",5],
["磨く","みがく","to brush, to polish","v",5],
["違う","ちがう","to be different, to be wrong","v",5],
["鳴く","なく","to cry (animals), to chirp","v",5],
["咲く","さく","to bloom","v",5],
["並べる","ならべる","to line up (things), to arrange","v",5],
["見せる","みせる","to show","v",5],
["", "もらう","to receive, to get","v",5],
["", "あげる","to give (to someone)","v",5],
["掛かる","かかる","to take (time or money)","v",5],
["掛ける","かける","to hang, to make (a phone call)","v",5],
["要る","いる","to need","v",5],
// ===== N5 — EXPANSION: adjectives & adverbs =====
["多い","おおい","many, numerous","adj",5],
["少ない","すくない","few, little","adj",5],
["同じ","おなじ","same","adj",5],
["色々","いろいろ","various","adj",5],
["大好き","だいすき","loved, really liked","adj",5],
["", "ちょうど","exactly, just","adv",5],
// ===== N4 — EXPANSION: conjunctions, pronouns (pos x) =====
["", "しかし","however, but","x",4],
["", "それで","and so, therefore","x",4],
["", "それに","besides, moreover","x",4],
["", "けれど","but, although","x",4],
["", "または","or, otherwise","x",4],
["", "ところで","by the way","x",4],
["", "すると","then, thereupon","x",4],
["", "なるほど","I see, indeed","x",4],
["彼","かれ","he, boyfriend","n",4],
["彼女","かのじょ","she, girlfriend","n",4],
["彼ら","かれら","they","n",4],
["自分","じぶん","oneself","n",4],
// ===== N4 — EXPANSION: nouns =====
["機械","きかい","machine","n",4],
["空気","くうき","air","n",4],
["計画","けいかく","plan, project","n",4],
["計算","けいさん","calculation","n",4],
["喧嘩","けんか","quarrel, fight","n",4],
["合格","ごうかく","passing (an exam)","n",4],
["故障","こしょう","breakdown, malfunction","n",4],
["", "ごみ","trash, rubbish","n",4],
["賛成","さんせい","approval, agreement","n",4],
["反対","はんたい","opposition, objection","n",4],
["社員","しゃいん","company employee","n",4],
["出席","しゅっせき","attendance","n",4],
["欠席","けっせき","absence (from an event)","n",4],
["遅刻","ちこく","being late, tardiness","n",4],
["出発","しゅっぱつ","departure","n",4],
["用事","ようじ","errand, business to attend to","n",4],
["専門","せんもん","specialty, field","n",4],
["講義","こうぎ","lecture","n",4],
["発音","はつおん","pronunciation","n",4],
["文法","ぶんぽう","grammar","n",4],
["会場","かいじょう","venue, event site","n",4],
["正月","しょうがつ","New Year","n",4],
["", "クリスマス","Christmas","n",4],
["", "プレゼント","present, gift","n",4],
["", "パーティー","party","n",4],
["", "コンサート","concert","n",4],
["展覧会","てんらんかい","exhibition","n",4],
["花見","はなみ","cherry blossom viewing","n",4],
["花火","はなび","fireworks","n",4],
["旅館","りょかん","Japanese inn","n",4],
["乗り物","のりもの","vehicle","n",4],
["船","ふね","ship, boat","n",4],
["急行","きゅうこう","express train","n",4],
["特急","とっきゅう","limited express train","n",4],
["運転","うんてん","driving","n",4],
["駐車場","ちゅうしゃじょう","parking lot","n",4],
["信号","しんごう","traffic light, signal","n",4],
["交差点","こうさてん","intersection","n",4],
["郵便","ゆうびん","mail, postal service","n",4],
["小包","こづつみ","parcel, package","n",4],
["封筒","ふうとう","envelope","n",4],
["葉書","はがき","postcard","n",4],
["住所","じゅうしょ","address","n",4],
["留守","るす","being away from home","n",4],
["", "カーテン","curtain","n",4],
["", "ビデオ","video","n",4],
["", "ゲーム","game","n",4],
["", "アニメ","anime, animation","n",4],
["雲","くも","cloud","n",4],
["坂","さか","slope, hill","n",4],
["馬","うま","horse","n",4],
["牛","うし","cow, cattle","n",4],
["豚","ぶた","pig","n",4],
["虫","むし","insect, bug","n",4],
["米","こめ","uncooked rice","n",4],
["味噌","みそ","miso","n",4],
["弁当","べんとう","boxed lunch","n",4],
["湯","ゆ","hot water","n",4],
["火","ひ","fire","n",4],
["光","ひかり","light","n",4],
["", "アルバイト","part-time job","n",4],
["安心","あんしん","relief, peace of mind","n",4],
["以上","いじょう","more than, the above","n",4],
["以下","いか","less than, the following","n",4],
["以内","いない","within","n",4],
["以外","いがい","except for, other than","n",4],
["帰り","かえり","the way back, return","n",4],
["忘れ物","わすれもの","forgotten item","n",4],
["お礼","おれい","thanks, gratitude","n",4],
["お祝い","おいわい","celebration, congratulatory gift","n",4],
["贈り物","おくりもの","gift, present","n",4],
["思い出","おもいで","memory, recollection","n",4],
["日記","にっき","diary","n",4],
["注文","ちゅうもん","order (for goods)","n",4],
["返事","へんじ","reply, answer","n",4],
["家具","かぐ","furniture","n",4],
["教育","きょういく","education","n",4],
["秒","びょう","second (of time)","n",4],
// ===== N4 — EXPANSION: verbs =====
["選ぶ","えらぶ","to choose, to select","v",4],
["頑張る","がんばる","to do one's best, to persist","v",4],
["聞こえる","きこえる","to be audible, to be heard","v",4],
["見える","みえる","to be visible, to be seen","v",4],
["思い出す","おもいだす","to recall, to remember","v",4],
["知らせる","しらせる","to inform, to notify","v",4],
["開く","あく","to open (by itself)","v",4],
["閉まる","しまる","to close (by itself)","v",4],
["空く","すく","to be hungry, to become less crowded","v",4],
["渇く","かわく","to be thirsty","v",4],
["写す","うつす","to copy, to photograph","v",4],
["乗り換える","のりかえる","to transfer (trains)","v",4],
["拭く","ふく","to wipe","v",4],
["踏む","ふむ","to step on","v",4],
["間違える","まちがえる","to make a mistake, to confuse","v",4],
["回る","まわる","to spin, to go around","v",4],
["役に立つ","やくにたつ","to be useful, to be helpful","v",4],
["沸かす","わかす","to boil (water)","v",4],
["", "いらっしゃる","to be, to come (honorific)","v",4],
["", "おっしゃる","to say (honorific)","v",4],
["召し上がる","めしあがる","to eat, to drink (honorific)","v",4],
["参る","まいる","to go, to come (humble)","v",4],
["申す","もうす","to say (humble)","v",4],
["", "いただく","to receive (humble)","v",4],
["", "くれる","to give (to me)","v",4],
["数える","かぞえる","to count","v",4],
["捕まえる","つかまえる","to catch, to capture","v",4],
["負ける","まける","to lose (a contest)","v",4],
["勝つ","かつ","to win","v",4],
// ===== N4 — EXPANSION: adjectives & adverbs =====
["", "うまい","tasty, skillful","adj",4],
["", "よろしい","fine, all right (polite)","adj",4],
["嫌","いや","unpleasant, disagreeable","adj",4],
["丈夫","じょうぶ","sturdy, durable","adj",4],
["普通","ふつう","ordinary, usual","adj",4],
["邪魔","じゃま","hindrance, in the way","adj",4],
["", "もうすぐ","soon, before long","adv",4],
["", "さっき","a little while ago","adv",4],
["", "やっと","at last, finally","adv",4],
["大体","だいたい","roughly, mostly","adv",4],
["大抵","たいてい","usually, generally","adv",4],
["", "もし","if, in case","adv",4],
// ===== N3 — EXPANSION: nouns (people & society) =====
["相手","あいて","partner, opponent","n",3],
["仲間","なかま","companion, comrade","n",3],
["仲","なか","relationship, terms","n",3],
["友人","ゆうじん","friend (formal)","n",3],
["知り合い","しりあい","acquaintance","n",3],
["他人","たにん","other people, stranger","n",3],
["本人","ほんにん","the person in question","n",3],
["大勢","おおぜい","crowd, many people","n",3],
["人々","ひとびと","people, everybody","n",3],
["国民","こくみん","citizens, the people","n",3],
["市民","しみん","city residents, citizens","n",3],
["住民","じゅうみん","residents, inhabitants","n",3],
["人類","じんるい","humanity, mankind","n",3],
["男性","だんせい","man, male (formal)","n",3],
["女性","じょせい","woman, female (formal)","n",3],
["老人","ろうじん","elderly person","n",3],
["若者","わかもの","young person, youth","n",3],
["青年","せいねん","young man, youth","n",3],
["少年","しょうねん","boy, juvenile","n",3],
["少女","しょうじょ","girl, young lady","n",3],
["夫","おっと","husband","n",3],
["妻","つま","wife","n",3],
["夫婦","ふうふ","married couple","n",3],
["親","おや","parent","n",3],
["親戚","しんせき","relatives","n",3],
["孫","まご","grandchild","n",3],
["息子","むすこ","son","n",3],
["娘","むすめ","daughter","n",3],
["赤ん坊","あかんぼう","baby","n",3],
["祖父","そふ","grandfather (one's own)","n",3],
["祖母","そぼ","grandmother (one's own)","n",3],
["大家","おおや","landlord","n",3],
["上司","じょうし","boss, superior","n",3],
["部下","ぶか","subordinate","n",3],
["同僚","どうりょう","colleague","n",3],
["会員","かいいん","member","n",3],
["選手","せんしゅ","athlete, player","n",3],
["監督","かんとく","director, coach","n",3],
["客","きゃく","guest, customer","n",3],
["係","かかり","person in charge","n",3],
["専門家","せんもんか","expert, specialist","n",3],
["学者","がくしゃ","scholar","n",3],
["教授","きょうじゅ","professor","n",3],
["講師","こうし","lecturer, instructor","n",3],
["弁護士","べんごし","lawyer","n",3],
["政治家","せいじか","politician","n",3],
["記者","きしゃ","reporter, journalist","n",3],
["作家","さっか","author, writer","n",3],
["俳優","はいゆう","actor","n",3],
["歌手","かしゅ","singer","n",3],
["画家","がか","painter, artist","n",3],
["迷子","まいご","lost child","n",3],
// ===== N3 — EXPANSION: nouns (abstract & daily life) =====
["機会","きかい","opportunity, chance","n",3],
["記事","きじ","article, news story","n",3],
["基礎","きそ","foundation, basics","n",3],
["疑問","ぎもん","question, doubt","n",3],
["休憩","きゅうけい","break, rest","n",3],
["救急車","きゅうきゅうしゃ","ambulance","n",3],
["行列","ぎょうれつ","queue, procession","n",3],
["記録","きろく","record, document","n",3],
["金額","きんがく","amount of money","n",3],
["緊張","きんちょう","tension, nervousness","n",3],
["苦情","くじょう","complaint","n",3],
["癖","くせ","habit (often bad)","n",3],
["工夫","くふう","ingenuity, devising","n",3],
["区別","くべつ","distinction","n",3],
["訓練","くんれん","training, drill","n",3],
["劇場","げきじょう","theater, playhouse","n",3],
["化粧","けしょう","makeup","n",3],
["欠点","けってん","fault, weak point","n",3],
["検査","けんさ","inspection, examination","n",3],
["現金","げんきん","cash","n",3],
["健康","けんこう","health","n",3],
["効果","こうか","effect, effectiveness","n",3],
["広告","こうこく","advertisement","n",3],
["工事","こうじ","construction work","n",3],
["交流","こうりゅう","exchange, interaction","n",3],
["呼吸","こきゅう","breathing","n",3],
["故郷","こきょう","hometown, birthplace","n",3],
["国籍","こくせき","nationality","n",3],
["個性","こせい","individuality","n",3],
["骨折","こっせつ","bone fracture","n",3],
["好み","このみ","preference, taste","n",3],
["混乱","こんらん","confusion, chaos","n",3],
["最高","さいこう","the best, highest","n",3],
["最低","さいてい","the worst, lowest","n",3],
["材料","ざいりょう","ingredients, materials","n",3],
["作業","さぎょう","work, operation","n",3],
["作品","さくひん","work (of art)","n",3],
["砂漠","さばく","desert","n",3],
["参加","さんか","participation","n",3],
["支度","したく","preparation, getting ready","n",3],
["失業","しつぎょう","unemployment","n",3],
["実験","じっけん","experiment","n",3],
["実力","じつりょく","real ability","n",3],
["指導","しどう","guidance, coaching","n",3],
["支払い","しはらい","payment","n",3],
["集合","しゅうごう","gathering, meeting up","n",3],
["渋滞","じゅうたい","traffic jam","n",3],
["修理","しゅうり","repair","n",3],
["手術","しゅじゅつ","surgery, operation","n",3],
["出身","しゅっしん","origin, hometown","n",3],
["正面","しょうめん","the front, facade","n",3],
["書類","しょるい","documents, papers","n",3],
["知らせ","しらせ","news, notice","n",3],
["印","しるし","mark, sign, symbol","n",3],
["信用","しんよう","trust, credit","n",3],
["信頼","しんらい","reliance, trust","n",3],
["数字","すうじ","numeral, figure","n",3],
["姿","すがた","figure, appearance","n",3],
["頭痛","ずつう","headache","n",3],
["制服","せいふく","uniform","n",3],
["整理","せいり","organizing, sorting","n",3],
["設備","せつび","equipment, facilities","n",3],
["線","せん","line","n",3],
["全員","ぜんいん","all members, everyone","n",3],
["損","そん","loss, disadvantage","n",3],
["得","とく","profit, advantage","n",3],
["体重","たいじゅう","body weight","n",3],
["立場","たちば","standpoint, position","n",3],
["例","れい","example","n",3],
["単語","たんご","word, vocabulary","n",3],
["誕生","たんじょう","birth","n",3],
["地区","ちく","district, zone","n",3],
["地方","ちほう","region, the provinces","n",3],
["中古","ちゅうこ","secondhand","n",3],
["調査","ちょうさ","survey, investigation","n",3],
["調子","ちょうし","condition, form","n",3],
["直接","ちょくせつ","direct, firsthand","n",3],
["通勤","つうきん","commuting to work","n",3],
["通訳","つうやく","interpreter, interpretation","n",3],
["梅雨","つゆ","rainy season","n",3],
["提出","ていしゅつ","submission, handing in","n",3],
["停電","ていでん","power outage","n",3],
["程度","ていど","degree, extent","n",3],
["手品","てじな","magic trick","n",3],
["手帳","てちょう","planner, pocket notebook","n",3],
["鉄","てつ","iron","n",3],
["徹夜","てつや","staying up all night","n",3],
["伝言","でんごん","verbal message","n",3],
["電池","でんち","battery","n",3],
["道具","どうぐ","tool, implement","n",3],
["動作","どうさ","movement, motion","n",3],
["到着","とうちゃく","arrival","n",3],
["道路","どうろ","road, highway","n",3],
["登山","とざん","mountain climbing","n",3],
["泥","どろ","mud","n",3],
["内緒","ないしょ","secret (kept casually)","n",3],
["納得","なっとく","being convinced, consent","n",3],
["名字","みょうじ","surname, family name","n",3],
["日常","にちじょう","everyday life","n",3],
["人気","にんき","popularity","n",3],
["寝坊","ねぼう","oversleeping","n",3],
["年齢","ねんれい","age","n",3],
["農業","のうぎょう","agriculture","n",3],
["場面","ばめん","scene, situation","n",3],
["早起き","はやおき","early rising","n",3],
["腹","はら","belly, abdomen","n",3],
["範囲","はんい","range, scope","n",3],
["販売","はんばい","sales, selling","n",3],
["引っ越し","ひっこし","moving (house)","n",3],
["評価","ひょうか","evaluation, rating","n",3],
["評判","ひょうばん","reputation","n",3],
["昼間","ひるま","daytime","n",3],
["広場","ひろば","plaza, open square","n",3],
["貧乏","びんぼう","poverty","n",3],
["物価","ぶっか","prices (of commodities)","n",3],
["物語","ものがたり","story, tale","n",3],
["部品","ぶひん","parts, components","n",3],
["雰囲気","ふんいき","atmosphere, mood","n",3],
["文句","もんく","complaint, objection","n",3],
["変更","へんこう","change, modification","n",3],
["方言","ほうげん","dialect","n",3],
["宝石","ほうせき","jewel, gem","n",3],
["包帯","ほうたい","bandage","n",3],
["保存","ほぞん","preservation, saving","n",3],
["歩道","ほどう","sidewalk","n",3],
["本物","ほんもの","genuine article, real thing","n",3],
["毎回","まいかい","every time","n",3],
["真夜中","まよなか","dead of night","n",3],
["満員","まんいん","full (of people)","n",3],
["満足","まんぞく","satisfaction","n",3],
["未満","みまん","less than, under","n",3],
["無料","むりょう","free of charge","n",3],
["有料","ゆうりょう","paid, charged","n",3],
["名物","めいぶつ","local specialty","n",3],
["目標","もくひょう","goal, target","n",3],
["文字","もじ","letter, character","n",3],
["優勝","ゆうしょう","championship, victory","n",3],
["友情","ゆうじょう","friendship","n",3],
["行方","ゆくえ","whereabouts","n",3],
["夜中","よなか","middle of the night","n",3],
["予算","よさん","budget","n",3],
["予想","よそう","prediction, expectation","n",3],
["予防","よぼう","prevention","n",3],
["理解","りかい","understanding","n",3],
["理想","りそう","ideal","n",3],
["流行","りゅうこう","trend, fashion","n",3],
["量","りょう","quantity, amount","n",3],
["両替","りょうがえ","currency exchange","n",3],
["例外","れいがい","exception","n",3],
["列車","れっしゃ","train (formal)","n",3],
["連休","れんきゅう","consecutive holidays","n",3],
["録音","ろくおん","audio recording","n",3],
["割引","わりびき","discount","n",3],
["悪口","わるぐち","bad-mouthing, insult","n",3],
["笑顔","えがお","smile, smiling face","n",3],
["家賃","やちん","rent (housing)","n",3],
["留守番","るすばん","house-sitting, staying home","n",3],
["領収書","りょうしゅうしょ","receipt (formal)","n",3],
["廊下","ろうか","hallway, corridor","n",3],
["労働","ろうどう","labor, work","n",3],
["論文","ろんぶん","thesis, academic paper","n",3],
["余裕","よゆう","leeway, composure","n",3],
["利益","りえき","profit, benefit","n",3],
["陸","りく","land (vs sea)","n",3],
["寮","りょう","dormitory","n",3],
// ===== N3 — EXPANSION: nouns (more) =====
["宇宙","うちゅう","space, universe","n",3],
["応援","おうえん","support, cheering","n",3],
["お辞儀","おじぎ","bow (greeting)","n",3],
["価格","かかく","price (formal)","n",3],
["価値","かち","value, worth","n",3],
["活躍","かつやく","active role, great efforts","n",3],
["家庭","かてい","household, family home","n",3],
["観察","かんさつ","observation","n",3],
["完成","かんせい","completion","n",3],
["看板","かんばん","signboard","n",3],
["営業","えいぎょう","business, sales","n",3],
["栄養","えいよう","nutrition","n",3],
["演技","えんぎ","acting, performance","n",3],
["延期","えんき","postponement","n",3],
["往復","おうふく","round trip","n",3],
["大雨","おおあめ","heavy rain","n",3],
["温泉","おんせん","hot spring","n",3],
["会計","かいけい","bill, accounting","n",3],
["外出","がいしゅつ","going out","n",3],
["回数","かいすう","number of times","n",3],
["開発","かいはつ","development","n",3],
["回復","かいふく","recovery","n",3],
["楽器","がっき","musical instrument","n",3],
["看病","かんびょう","nursing (a sick person)","n",3],
["帰国","きこく","returning to one's country","n",3],
["基準","きじゅん","standard, criterion","n",3],
["帰宅","きたく","returning home","n",3],
["記念","きねん","commemoration","n",3],
["機能","きのう","function","n",3],
["寄付","きふ","donation","n",3],
["基本","きほん","basics, fundamentals","n",3],
["休暇","きゅうか","vacation, leave","n",3],
["休日","きゅうじつ","day off, holiday","n",3],
["競技","きょうぎ","competition, sporting event","n",3],
["行事","ぎょうじ","event, function","n",3],
["協力","きょうりょく","cooperation","n",3],
["金属","きんぞく","metal","n",3],
["配達","はいたつ","delivery","n",3],
["爆発","ばくはつ","explosion","n",3],
["発見","はっけん","discovery","n",3],
["発表","はっぴょう","announcement, presentation","n",3],
["発明","はつめい","invention","n",3],
["話し合い","はなしあい","discussion, talks","n",3],
["品質","ひんしつ","quality (of goods)","n",3],
["普段","ふだん","usual times, ordinarily","n",3],
["服装","ふくそう","attire, dress","n",3],
["不満","ふまん","dissatisfaction","n",3],
["平日","へいじつ","weekday","n",3],
["翻訳","ほんやく","translation","n",3],
["迷惑","めいわく","nuisance, trouble","n",3],
// ===== N3 — EXPANSION: verbs =====
["扱う","あつかう","to handle, to deal with","v",3],
["編む","あむ","to knit, to braid","v",3],
["暴れる","あばれる","to act violently, to rampage","v",3],
["悲しむ","かなしむ","to grieve, to feel sad","v",3],
["抱える","かかえる","to carry (in arms), to have (problems)","v",3],
["関わる","かかわる","to be involved with","v",3],
["描く","えがく","to draw, to depict","v",3],
["欠ける","かける","to lack, to chip","v",3],
["囲む","かこむ","to surround","v",3],
["重なる","かさなる","to overlap, to pile up","v",3],
["構う","かまう","to mind, to care about","v",3],
["噛む","かむ","to bite, to chew","v",3],
["乾かす","かわかす","to dry (something)","v",3],
["効く","きく","to be effective, to work","v",3],
["刻む","きざむ","to chop finely, to engrave","v",3],
["鍛える","きたえる","to train, to forge","v",3],
["気付く","きづく","to notice, to realize","v",3],
["嫌う","きらう","to dislike, to hate","v",3],
["腐る","くさる","to rot, to go bad","v",3],
["崩れる","くずれる","to collapse, to crumble","v",3],
["下る","くだる","to descend, to go down","v",3],
["組む","くむ","to assemble, to pair up","v",3],
["暮れる","くれる","to get dark, to come to an end","v",3],
["加わる","くわわる","to join, to be added","v",3],
["凍る","こおる","to freeze","v",3],
["焦げる","こげる","to get burnt, to scorch","v",3],
["異なる","ことなる","to differ","v",3],
["好む","このむ","to prefer, to like","v",3],
["転がる","ころがる","to roll, to tumble","v",3],
["殺す","ころす","to kill","v",3],
["避ける","さける","to avoid","v",3],
["刺す","さす","to stab, to sting","v",3],
["覚める","さめる","to wake up, to sober up","v",3],
["冷める","さめる","to cool down","v",3],
["去る","さる","to leave, to depart","v",3],
["仕舞う","しまう","to put away, to finish","v",3],
["縛る","しばる","to tie up, to bind","v",3],
["絞る","しぼる","to squeeze, to wring","v",3],
["従う","したがう","to obey, to follow","v",3],
["支払う","しはらう","to pay (formal)","v",3],
["優れる","すぐれる","to excel, to be superior","v",3],
["済む","すむ","to be finished, to be settled","v",3],
["備える","そなえる","to prepare for, to equip","v",3],
["揃う","そろう","to be complete, to gather","v",3],
["揃える","そろえる","to arrange, to make uniform","v",3],
["倒す","たおす","to knock down, to defeat","v",3],
["高める","たかめる","to raise, to boost","v",3],
["助かる","たすかる","to be saved, to be helpful","v",3],
["戦う","たたかう","to fight, to battle","v",3],
["畳む","たたむ","to fold","v",3],
["例える","たとえる","to compare, to liken","v",3],
["足す","たす","to add (numbers)","v",3],
["騙す","だます","to deceive, to trick","v",3],
["貯める","ためる","to save up, to accumulate","v",3],
["保つ","たもつ","to maintain, to preserve","v",3],
["散る","ちる","to scatter, to fall (petals)","v",3],
["捕まる","つかまる","to be caught","v",3],
["付く","つく","to be attached, to stick","v",3],
["伝わる","つたわる","to be transmitted, to spread","v",3],
["繋ぐ","つなぐ","to connect, to link","v",3],
["繋がる","つながる","to be connected","v",3],
["詰まる","つまる","to be blocked, to be packed","v",3],
["詰める","つめる","to pack, to stuff","v",3],
["積もる","つもる","to pile up (snow)","v",3],
["照る","てる","to shine (sun)","v",3],
["通す","とおす","to let through, to pass","v",3],
["解ける","とける","to be solved, to come untied","v",3],
["溶ける","とける","to melt, to dissolve","v",3],
["飛ばす","とばす","to make fly, to skip over","v",3],
["飛び出す","とびだす","to rush out, to jump out","v",3],
["泊める","とめる","to lodge (someone)","v",3],
["取り替える","とりかえる","to swap, to replace","v",3],
["取り消す","とりけす","to cancel","v",3],
["眺める","ながめる","to gaze at","v",3],
["鳴らす","ならす","to ring, to sound (something)","v",3],
["逃がす","にがす","to let escape, to set free","v",3],
["抜く","ぬく","to pull out, to extract","v",3],
["抜ける","ぬける","to come out, to be missing","v",3],
["塗る","ぬる","to paint, to spread on","v",3],
["狙う","ねらう","to aim at","v",3],
["延ばす","のばす","to postpone, to extend","v",3],
["載る","のる","to be published, to be placed on","v",3],
["計る","はかる","to measure","v",3],
["吐く","はく","to vomit, to breathe out","v",3],
["外す","はずす","to remove, to take off","v",3],
["外れる","はずれる","to come off, to miss (a guess)","v",3],
["離す","はなす","to separate, to keep apart","v",3],
["張る","はる","to stretch, to put up","v",3],
["貼る","はる","to paste, to stick on","v",3],
["冷やす","ひやす","to chill, to cool","v",3],
["開く","ひらく","to open, to hold (an event)","v",3],
["増やす","ふやす","to increase (something)","v",3],
["振る","ふる","to wave, to shake","v",3],
["干す","ほす","to hang out to dry","v",3],
["巻く","まく","to wind, to roll up","v",3],
["混ざる","まざる","to be mixed","v",3],
["学ぶ","まなぶ","to learn, to study","v",3],
["回す","まわす","to turn, to rotate (something)","v",3],
["見つめる","みつめる","to stare at, to gaze at","v",3],
["向く","むく","to face, to turn toward","v",3],
["向ける","むける","to point toward, to direct","v",3],
["目立つ","めだつ","to stand out","v",3],
["茹でる","ゆでる","to boil (food)","v",3],
["汚す","よごす","to make dirty","v",3],
["分ける","わける","to divide, to share","v",3],
["辞める","やめる","to resign, to quit (a job)","v",3],
["楽しむ","たのしむ","to enjoy","v",3],
["減らす","へらす","to reduce, to decrease (something)","v",3],
["通じる","つうじる","to get through, to be understood","v",3],
["移る","うつる","to move, to transfer","v",3],
["映る","うつる","to be reflected, to appear (on screen)","v",3],
["贈る","おくる","to give (a gift)","v",3],
["伺う","うかがう","to visit, to ask (humble)","v",3],
["乗り遅れる","のりおくれる","to miss (a train)","v",3],
// ===== N3 — EXPANSION: adjectives =====
["重大","じゅうだい","serious, grave","adj",3],
["順調","じゅんちょう","smooth, going well","adj",3],
["正常","せいじょう","normal","adj",3],
["異常","いじょう","abnormal, unusual","adj",3],
["贅沢","ぜいたく","luxurious, extravagant","adj",3],
["独特","どくとく","unique, distinctive","adj",3],
["平等","びょうどう","equal, fair","adj",3],
["深刻","しんこく","serious, grave (situation)","adj",3],
["不幸","ふこう","unhappy, misfortune","adj",3],
["無事","ぶじ","safe, without incident","adj",3],
["不利","ふり","disadvantageous","adj",3],
["有利","ゆうり","advantageous","adj",3],
["豊富","ほうふ","abundant, plentiful","adj",3],
["真っ赤","まっか","bright red","adj",3],
["真っ暗","まっくら","pitch dark","adj",3],
["真っ白","まっしろ","pure white","adj",3],
["真っ青","まっさお","deep blue, deathly pale","adj",3],
["真っ黒","まっくろ","jet black","adj",3],
["見事","みごと","splendid, magnificent","adj",3],
["優秀","ゆうしゅう","excellent, outstanding","adj",3],
["愉快","ゆかい","pleasant, merry","adj",3],
["余計","よけい","unnecessary, excessive","adj",3],
["利口","りこう","clever, smart","adj",3],
["冷静","れいせい","calm, composed","adj",3],
["有効","ゆうこう","valid, effective","adj",3],
["", "わがまま","selfish, spoiled","adj",3],
["", "しつこい","persistent, nagging","adj",3],
["", "だらしない","slovenly, sloppy","adj",3],
["", "とんでもない","outrageous, unthinkable","adj",3],
["", "めでたい","joyous, auspicious","adj",3],
["", "ものすごい","terrific, tremendous","adj",3],
// ===== N3 — EXPANSION: adverbs =====
["改めて","あらためて","anew, once again","adv",3],
["一応","いちおう","tentatively, for the time being","adv",3],
["一度に","いちどに","all at once","adv",3],
["今にも","いまにも","at any moment","adv",3],
["", "いよいよ","finally, at last","adv",3],
["恐らく","おそらく","probably, likely","adv",3],
["思い切り","おもいきり","with all one's might","adv",3],
["", "かなり","considerably, quite","adv",3],
["", "ぎりぎり","just barely, at the limit","adv",3],
["決して","けっして","never (with negative)","adv",3],
["", "さっぱり","(not) at all; refreshed","adv",3],
["少々","しょうしょう","a little, a moment (formal)","adv",3],
["多少","たしょう","somewhat, more or less","adv",3],
["", "たっぷり","plenty, amply","adv",3],
["", "ちっとも","(not) a bit","adv",3],
["", "とにかく","anyway, in any case","adv",3],
["", "なんとなく","somehow, vaguely","adv",3],
["元々","もともと","originally, by nature","adv",3],
["", "ようやく","finally, barely","adv",3],
["割と","わりと","comparatively, relatively","adv",3],
["", "せっかく","with much effort, specially","adv",3],
["", "せめて","at least, at most","adv",3],
["大して","たいして","(not) very much","adv",3],
["", "つい","unintentionally, just (now)","adv",3],
["", "どうしても","no matter what, by all means","adv",3],
["", "ほぼ","almost, roughly","adv",3],
["", "まさか","surely not, no way","adv",3],
["", "まさに","exactly, precisely","adv",3],
["", "むしろ","rather, instead","adv",3],
// ===== N3 — EXPANSION: conjunctions (pos x) =====
["", "それとも","or (in questions)","x",3],
["", "ところが","however, contrary to expectations","x",3],
["", "ただし","however, provided that","x",3],
["", "だが","but, yet (formal)","x",3],
["", "さて","well now, by the way","x",3],
["一方","いっぽう","on the other hand","x",3],
];

// ─── Audio (WebAudio arcade blips) ───
let actx = null;
function ensureAudio() {
  if (!actx) {
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; }
  }
  if (actx && actx.state === "suspended") actx.resume();
}
function blip(freq, dur, type, vol, delay) {
  if (!actx) return;
  const t = actx.currentTime + (delay || 0);
  const o = actx.createOscillator();
  const g = actx.createGain();
  o.type = type || "sine";
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol || 0.07, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(actx.destination);
  o.start(t); o.stop(t + dur + 0.02);
}
const sfxCorrect = () => { blip(880, 0.09, "sine", 0.07, 0); blip(1318, 0.14, "sine", 0.07, 0.07); };
const sfxWrong = () => { blip(150, 0.22, "square", 0.05, 0); };
const sfxCombo = () => { blip(988, 0.07, "sine", 0.06, 0); blip(1318, 0.07, "sine", 0.06, 0.06); blip(1760, 0.16, "sine", 0.07, 0.12); };

// ─── Config tables ───
const MODES = [
  { id: "m1", jp: "意味 → かな", desc: "Meaning shown — pick the kana" },
  { id: "m2", jp: "語 → 意味", desc: "Word shown — pick the meaning" },
  { id: "m3", jp: "漢字 → かな", desc: "Kanji shown — pick the reading" },
];
const GAME_STYLES = [
  { id: "time", jp: "タイムアタック", desc: "60s on the clock · wrong answers cost −5s" },
  { id: "endless", jp: "エンドレス", desc: "Per-word countdown that shrinks · 3 strikes and you are out" },
];
const LEVELS = [
  { id: 5, label: "N5" },
  { id: 4, label: "N4" },
  { id: 3, label: "N3" },
  { id: 0, label: "N5–N3" },
];
const POS_OPTS = [
  { id: "all", jp: "全部", en: "All" },
  { id: "n", jp: "名詞", en: "Nouns" },
  { id: "v", jp: "動詞", en: "Verbs" },
  { id: "adj", jp: "形容詞", en: "Adjectives" },
  { id: "adv", jp: "副詞", en: "Adverbs" },
  { id: "x", jp: "その他", en: "Phrases etc." },
];

const TIME_ATTACK_SECONDS = 60;
const WRONG_PENALTY = 5;
const ENDLESS_START = 8.0;   // seconds per word at the start
const ENDLESS_FLOOR = 3.5;   // never shrinks below this
const ENDLESS_STEP = 0.12;   // shaved off per correct answer

function buildPool(level, pos, mode) {
  return VOCAB.filter((w) =>
    (level === 0 ? true : w[4] === level) &&
    (pos === "all" ? true : w[3] === pos) &&
    (mode === "m3" ? w[0] !== "" : true)
  );
}
function questionText(w, mode) {
  if (mode === "m1") return w[2];
  if (mode === "m2") return w[0] !== "" ? w[0] : w[1];
  return w[0];
}
function answerText(w, mode) {
  return mode === "m2" ? w[2] : w[1];
}
function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function SpeedMatch() {
  const [phase, setPhase] = useState("setup"); // setup | play | results
  const [mode, setMode] = useState("m1");
  const [style, setStyle] = useState("time");
  const [level, setLevel] = useState(5);
  const [pos, setPos] = useState("all");

  const [question, setQuestion] = useState(null); // {word, options:[{word,text}], correctIdx}
  const [feedback, setFeedback] = useState(null); // {chosen, correct, timeout?}
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_ATTACK_SECONDS);
  const [wordTime, setWordTime] = useState(ENDLESS_START);
  const [penaltyFlash, setPenaltyFlash] = useState(0);
  const [comboPop, setComboPop] = useState(0);

  const lockedRef = useRef(false);
  const recentRef = useRef([]);
  const allotRef = useRef(ENDLESS_START);
  const qStartRef = useRef(0);
  const poolRef = useRef([]);
  const timerRef = useRef(null);
  const timeoutsRef = useRef([]);
  const stateRef = useRef({});
  stateRef.current = { strikes, mode, style };

  const setupPool = useMemo(() => buildPool(level, pos, mode), [level, pos, mode]);
  const canStart = setupPool.length >= 8;

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);
  const later = (fn, ms) => { timeoutsRef.current.push(setTimeout(fn, ms)); };

  const nextQuestion = useCallback(() => {
    const pool = poolRef.current;
    const m = stateRef.current.mode;
    const recent = recentRef.current;
    const recentCap = Math.min(20, Math.max(0, pool.length - 5));

    let word = null;
    for (let tries = 0; tries < 60; tries++) {
      const cand = pool[Math.floor(Math.random() * pool.length)];
      if (!recent.includes(cand)) { word = cand; break; }
    }
    if (!word) word = pool[Math.floor(Math.random() * pool.length)];
    recent.push(word);
    while (recent.length > recentCap) recent.shift();

    const correctAns = answerText(word, m);
    const qText = questionText(word, m);
    const used = new Set([correctAns, qText]);
    const distractors = [];
    const tryAdd = (cands) => {
      for (const c of cands) {
        if (distractors.length >= 3) return;
        if (c === word) continue;
        const t = answerText(c, m);
        if (used.has(t)) continue;
        if (questionText(c, m) === qText) continue;
        used.add(t);
        distractors.push(c);
      }
    };
    tryAdd(shuffle(pool.filter((w) => w[3] === word[3])));
    if (distractors.length < 3) tryAdd(shuffle(pool));
    if (distractors.length < 3) tryAdd(shuffle(VOCAB.filter((w) => (m !== "m3" || w[0] !== ""))));

    const opts = shuffle([word, ...distractors]).map((w) => ({ word: w, text: answerText(w, m) }));
    const correctIdx = opts.findIndex((o) => o.word === word);

    lockedRef.current = false;
    qStartRef.current = Date.now();
    setFeedback(null);
    setQuestion({ word, options: opts, correctIdx, qText });
    if (stateRef.current.style === "endless") setWordTime(allotRef.current);
  }, []);

  const endGame = useCallback(() => {
    clearTimers();
    lockedRef.current = true;
    setPhase("results");
  }, [clearTimers]);

  const startGame = useCallback(() => {
    ensureAudio();
    clearTimers();
    poolRef.current = setupPool;
    recentRef.current = [];
    allotRef.current = ENDLESS_START;
    lockedRef.current = false;
    setScore(0); setCombo(0); setMaxCombo(0); setStrikes(0);
    setAnswered(0); setCorrectCount(0); setMissed([]);
    setPenaltyFlash(0); setComboPop(0);
    setTimeLeft(TIME_ATTACK_SECONDS);
    setWordTime(ENDLESS_START);
    setPhase("play");
    nextQuestion();

    timerRef.current = setInterval(() => {
      if (stateRef.current.style === "time") {
        setTimeLeft((t) => {
          const nt = t - 0.1;
          if (nt <= 0) { endGame(); return 0; }
          return nt;
        });
      } else {
        if (lockedRef.current) return;
        setWordTime((t) => {
          const nt = t - 0.1;
          if (nt <= 0) { handleTimeout(); return 0; }
          return nt;
        });
      }
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupPool, nextQuestion, endGame, clearTimers]);

  const handleTimeoutRef = useRef(() => {});
  function handleTimeout() { handleTimeoutRef.current(); }

  handleTimeoutRef.current = () => {
    if (lockedRef.current || !question) return;
    lockedRef.current = true;
    sfxWrong();
    setCombo(0);
    setAnswered((a) => a + 1);
    setMissed((ms) => [...ms, question.word]);
    setFeedback({ chosen: -1, correct: question.correctIdx, timeout: true });
    const ns = stateRef.current.strikes + 1;
    setStrikes(ns);
    later(() => { ns >= 3 ? endGame() : nextQuestion(); }, 1000);
  };

  const answer = (idx) => {
    if (lockedRef.current || !question) return;
    lockedRef.current = true;
    const isCorrect = idx === question.correctIdx;
    const elapsed = (Date.now() - qStartRef.current) / 1000;
    setAnswered((a) => a + 1);

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));
      if (newCombo > 0 && newCombo % 10 === 0) { sfxCombo(); } else { sfxCorrect(); }
      setComboPop((p) => p + 1);
      const mult = Math.min(1 + Math.floor(newCombo / 5) * 0.5, 4);
      let pts = 100;
      if (style === "endless") {
        pts += Math.round(Math.max(0, wordTime) * 10);
        allotRef.current = Math.max(ENDLESS_FLOOR, allotRef.current - ENDLESS_STEP);
      } else if (elapsed < 2) {
        pts += 50;
      }
      setScore((s) => s + Math.round(pts * mult));
      setCorrectCount((c) => c + 1);
      setFeedback({ chosen: idx, correct: question.correctIdx });
      later(nextQuestion, 450);
    } else {
      sfxWrong();
      setCombo(0);
      setMissed((ms) => [...ms, question.word]);
      setFeedback({ chosen: idx, correct: question.correctIdx });
      if (style === "time") {
        setPenaltyFlash((p) => p + 1);
        setTimeLeft((t) => {
          const nt = t - WRONG_PENALTY;
          if (nt <= 0) { later(endGame, 900); return 0; }
          return nt;
        });
        later(nextQuestion, 900);
      } else {
        const ns = strikes + 1;
        setStrikes(ns);
        later(() => { ns >= 3 ? endGame() : nextQuestion(); }, 1000);
      }
    }
  };

  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;
  const mult = Math.min(1 + Math.floor(combo / 5) * 0.5, 4);
  const timeFrac = style === "time" ? timeLeft / TIME_ATTACK_SECONDS : wordTime / allotRef.current;
  const barColor = timeFrac > 0.5 ? "var(--cyan)" : timeFrac > 0.25 ? "var(--gold)" : "var(--pink)";

  // ─── styles ───
  const css = `
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Noto+Sans+JP:wght@500;700&display=swap');
  :root { --bg:#0B0D17; --panel:#151829; --panel2:#1C2038; --line:#2A2F4D;
    --pink:#FF3D7F; --cyan:#2DE2E6; --gold:#FFD23F; --text:#F2F3F8; --muted:#8A8FA8;
    --good:#3DDC84; --bad:#FF5252;
    --jp:'Noto Sans JP','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif; }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  .sm-root { min-height:100vh; background:var(--bg); color:var(--text);
    font-family:'DotGothic16','Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;
    display:flex; flex-direction:column; align-items:center; padding:16px;
    background-image: radial-gradient(circle at 20% 0%, rgba(255,61,127,.08), transparent 45%),
      radial-gradient(circle at 85% 100%, rgba(45,226,230,.07), transparent 45%); }
  .sm-shell { width:100%; max-width:560px; }
  .sm-title { text-align:center; margin:8px 0 2px; font-size:clamp(26px,7vw,38px); letter-spacing:2px;
    color:var(--text); text-shadow:0 0 18px rgba(255,61,127,.55), 0 0 36px rgba(45,226,230,.25); }
  .sm-sub { text-align:center; color:var(--muted); font-size:13px; margin-bottom:18px; letter-spacing:1px; }
  .sm-label { font-size:12px; letter-spacing:2px; color:var(--cyan); margin:18px 0 8px; text-transform:uppercase; }
  .sm-grid { display:grid; gap:8px; }
  .g2 { grid-template-columns:1fr 1fr; } .g3 { grid-template-columns:repeat(3,1fr); }
  .g4 { grid-template-columns:repeat(4,1fr); } .g5 { grid-template-columns:repeat(5,1fr); }
  .opt { background:var(--panel); border:1px solid var(--line); color:var(--text);
    border-radius:10px; padding:12px 8px; cursor:pointer; text-align:center;
    font-family:var(--jp); font-weight:700; font-size:15px;
    transition:transform .08s, border-color .12s, background .12s; }
  .opt small { display:block; color:var(--muted); font-size:10.5px; margin-top:4px; line-height:1.35;
    font-family:system-ui,sans-serif; }
  .opt.on { border-color:var(--pink); background:linear-gradient(180deg, rgba(255,61,127,.18), rgba(255,61,127,.05));
    box-shadow:0 0 0 1px var(--pink), 0 0 16px rgba(255,61,127,.35); }
  .opt:active { transform:scale(.97); }
  .pool { text-align:center; color:var(--muted); font-size:13px; margin-top:14px;
    font-family:system-ui,sans-serif; }
  .pool b { color:var(--gold); font-size:16px; }
  .start { width:100%; margin-top:14px; padding:16px; font-family:inherit; font-size:20px; letter-spacing:3px;
    color:#0B0D17; background:linear-gradient(90deg,var(--pink),#FF7AA8); border:none; border-radius:12px;
    cursor:pointer; box-shadow:0 0 22px rgba(255,61,127,.5); }
  .start:disabled { background:var(--panel2); color:var(--muted); box-shadow:none; cursor:not-allowed; }
  .hud { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:8px; }
  .hud .sc { font-size:24px; color:var(--gold); text-shadow:0 0 10px rgba(255,210,63,.5); }
  .hud .lbl { font-size:10px; color:var(--muted); letter-spacing:2px; font-family:system-ui,sans-serif; }
  .combo { font-size:20px; color:var(--cyan); text-align:right; }
  .combo.hot { color:var(--pink); text-shadow:0 0 12px rgba(255,61,127,.7); }
  @keyframes pop { 0%{transform:scale(1.6)} 100%{transform:scale(1)} }
  .combo.popping { animation:pop .18s ease-out; }
  .gauge { height:14px; background:var(--panel2); border:1px solid var(--line); border-radius:7px;
    overflow:hidden; position:relative; margin-bottom:4px; }
  .gauge > div { height:100%; transition:width .1s linear, background-color .3s; border-radius:6px;
    box-shadow:0 0 12px currentColor; }
  .gtxt { display:flex; justify-content:space-between; font-size:11px; color:var(--muted);
    font-family:system-ui,sans-serif; margin-bottom:14px; }
  @keyframes flashRed { 0%{color:var(--bad); transform:scale(1.3)} 100%{color:var(--muted); transform:scale(1)} }
  .pen { animation:flashRed .6s ease-out; }
  .strikes { letter-spacing:4px; font-size:16px; }
  .qcard { background:var(--panel); border:1px solid var(--line); border-radius:14px;
    min-height:120px; display:flex; align-items:center; justify-content:center; text-align:center;
    padding:18px 14px; margin-bottom:14px; position:relative; }
  .qcard .q { font-size:clamp(24px,7vw,40px); line-height:1.3; word-break:break-word;
    font-family:var(--jp); font-weight:700; }
  .qcard .modechip { position:absolute; top:8px; left:10px; font-size:10px; color:var(--muted);
    letter-spacing:1px; font-family:system-ui,sans-serif; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
  .qcard.wrong { animation:shake .3s; border-color:var(--bad); }
  .answers { display:grid; gap:10px; }
  .ans { background:var(--panel); border:1px solid var(--line); color:var(--text); border-radius:12px;
    padding:16px 14px; font-family:var(--jp); font-weight:500; font-size:clamp(17px,4.5vw,22px);
    cursor:pointer; text-align:center;
    transition:transform .06s, background .1s, border-color .1s; word-break:break-word; line-height:1.35; }
  .ans:active { transform:scale(.98); }
  .ans.correct { background:rgba(61,220,132,.18); border-color:var(--good);
    box-shadow:0 0 14px rgba(61,220,132,.4); }
  .ans.chosen-wrong { background:rgba(255,82,82,.16); border-color:var(--bad); }
  .ans.dim { opacity:.45; }
  .tofeed { text-align:center; color:var(--bad); font-size:13px; min-height:18px; margin-top:10px;
    font-family:system-ui,sans-serif; }
  .res { background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:20px; margin-top:8px; }
  .res h2 { margin:0 0 4px; font-size:18px; color:var(--pink); letter-spacing:2px; text-align:center; }
  .bigscore { text-align:center; font-size:44px; color:var(--gold); text-shadow:0 0 16px rgba(255,210,63,.5); margin:6px 0 14px; }
  .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; text-align:center; margin-bottom:16px; }
  .stats div { background:var(--panel2); border-radius:10px; padding:10px 4px; }
  .stats b { display:block; font-size:20px; color:var(--cyan); }
  .stats span { font-size:10px; color:var(--muted); letter-spacing:1px; font-family:system-ui,sans-serif; }
  .missed { max-height:240px; overflow-y:auto; border-top:1px solid var(--line); padding-top:10px; }
  .missed .mrow { display:flex; gap:10px; align-items:baseline; padding:7px 2px; border-bottom:1px solid rgba(42,47,77,.5); }
  .mrow .mk { font-size:18px; min-width:72px; font-family:var(--jp); font-weight:700; }
  .mrow .mr { color:var(--cyan); font-size:14px; font-family:var(--jp); font-weight:500; }
  .mrow .mm { color:var(--muted); font-size:12px; font-family:system-ui,sans-serif; margin-left:auto; text-align:right; }
  .row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:16px; }
  .btn2 { padding:14px; font-family:inherit; font-size:16px; letter-spacing:2px; border-radius:10px; cursor:pointer; }
  .again { color:#0B0D17; background:var(--cyan); border:none; box-shadow:0 0 16px rgba(45,226,230,.4); }
  .back { color:var(--text); background:var(--panel2); border:1px solid var(--line); }
  .quit { display:block; margin:18px auto 0; background:none; border:none; color:var(--muted);
    font-family:system-ui,sans-serif; font-size:12px; cursor:pointer; text-decoration:underline; }
  @media (prefers-reduced-motion: reduce) { .combo.popping,.qcard.wrong,.pen { animation:none; } }
  `;

  // ─── SETUP SCREEN ───
  if (phase === "setup") {
    return (
      <div className="sm-root"><style>{css}</style>
        <div className="sm-shell">
          <h1 className="sm-title">速攻マッチ</h1>
          <div className="sm-sub">SPEED MATCH · JLPT VOCAB · {VOCAB.length} WORDS LOADED</div>

          <div className="sm-label">Question type</div>
          <div className="sm-grid">
            {MODES.map((m) => (
              <button key={m.id} className={"opt" + (mode === m.id ? " on" : "")} onClick={() => setMode(m.id)}>
                {m.jp}<small>{m.desc}</small>
              </button>
            ))}
          </div>

          <div className="sm-label">Game style</div>
          <div className="sm-grid">
            {GAME_STYLES.map((s) => (
              <button key={s.id} className={"opt" + (style === s.id ? " on" : "")} onClick={() => setStyle(s.id)}>
                {s.jp}<small>{s.desc}</small>
              </button>
            ))}
          </div>

          <div className="sm-label">Level</div>
          <div className="sm-grid g4">
            {LEVELS.map((l) => (
              <button key={l.id} className={"opt" + (level === l.id ? " on" : "")} onClick={() => setLevel(l.id)}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="sm-label">Vocabulary focus</div>
          <div className="sm-grid g3">
            {POS_OPTS.map((p) => (
              <button key={p.id} className={"opt" + (pos === p.id ? " on" : "")} onClick={() => setPos(p.id)}>
                {p.jp}<small>{p.en}</small>
              </button>
            ))}
          </div>

          <div className="pool">Word pool for these settings: <b>{setupPool.length}</b></div>
          <button className="start" disabled={!canStart} onClick={startGame}>
            {canStart ? "スタート" : "Pool too small"}
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTS SCREEN ───
  if (phase === "results") {
    return (
      <div className="sm-root"><style>{css}</style>
        <div className="sm-shell">
          <div className="res">
            <h2>{style === "endless" && strikes >= 3 ? "GAME OVER" : "TIME UP"}</h2>
            <div className="bigscore">{score.toLocaleString()}</div>
            <div className="stats">
              <div><b>{answered}</b><span>ANSWERED</span></div>
              <div><b>{accuracy}%</b><span>ACCURACY</span></div>
              <div><b>×{maxCombo}</b><span>MAX COMBO</span></div>
            </div>
            {missed.length > 0 && (
              <>
                <div className="sm-label" style={{ marginTop: 0 }}>Missed words ({missed.length})</div>
                <div className="missed">
                  {missed.map((w, i) => (
                    <div className="mrow" key={i}>
                      <span className="mk">{w[0] !== "" ? w[0] : w[1]}</span>
                      <span className="mr">{w[1]}</span>
                      <span className="mm">{w[2]}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="row2">
              <button className="btn2 again" onClick={startGame}>もう一回</button>
              <button className="btn2 back" onClick={() => { clearTimers(); setPhase("setup"); }}>設定</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAY SCREEN ───
  const fbWrong = feedback && (feedback.timeout || feedback.chosen !== feedback.correct);
  return (
    <div className="sm-root"><style>{css}</style>
      <div className="sm-shell">
        <div className="hud">
          <div>
            <div className="lbl">SCORE {mult > 1 ? `· ×${mult}` : ""}</div>
            <div className="sc">{score.toLocaleString()}</div>
          </div>
          {style === "endless" ? (
            <div style={{ textAlign: "center" }}>
              <div className="lbl">STRIKES</div>
              <div className="strikes">
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ color: i < strikes ? "var(--bad)" : "var(--line)" }}>✕</span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div key={penaltyFlash} className={penaltyFlash ? "lbl pen" : "lbl"}>
                {penaltyFlash ? `−${WRONG_PENALTY}s` : "TIME"}
              </div>
              <div style={{ fontSize: 22 }}>{Math.ceil(timeLeft)}</div>
            </div>
          )}
          <div>
            <div className="lbl" style={{ textAlign: "right" }}>COMBO</div>
            <div key={comboPop} className={"combo popping" + (combo >= 10 ? " hot" : "")}>
              {combo > 0 ? `${combo}連` : "—"}
            </div>
          </div>
        </div>

        <div className="gauge">
          <div style={{ width: `${Math.max(0, Math.min(1, timeFrac)) * 100}%`, backgroundColor: barColor, color: barColor }} />
        </div>
        <div className="gtxt">
          <span>{MODES.find((m) => m.id === mode).jp}</span>
          <span>{style === "endless" ? `${wordTime.toFixed(1)}s / word` : "TIME ATTACK"}</span>
        </div>

        {question && (
          <>
            <div className={"qcard" + (fbWrong ? " wrong" : "")}>
              <span className="modechip">
                {mode === "m1" ? "PICK THE KANA" : mode === "m2" ? "PICK THE MEANING" : "PICK THE READING"}
              </span>
              <div className="q">{question.qText}</div>
            </div>
            <div className="answers">
              {question.options.map((o, i) => {
                let cls = "ans";
                if (feedback) {
                  if (i === feedback.correct) cls += " correct";
                  else if (i === feedback.chosen) cls += " chosen-wrong";
                  else cls += " dim";
                }
                return (
                  <button key={i} className={cls} onClick={() => answer(i)} disabled={!!feedback}>
                    {o.text}
                  </button>
                );
              })}
            </div>
            <div className="tofeed">{feedback && feedback.timeout ? "時間切れ! Too slow!" : ""}</div>
          </>
        )}
        <button className="quit" onClick={endGame}>End run</button>
      </div>
    </div>
  );
}
