/**
 * 数据获取
 * - 双击 HTML 本地打开（file://）：使用内嵌数据
 * - Live Server 或部署后：读取 data/ 下的 JSON 文件
 */

const GITHUB_USER = 'TsangHaotian';
const GITHUB_REPO = '404BlogFound';

// 内嵌数据（用于双击本地打开）
const EMBEDDED_PROJECTS = [{"name":"404BlogFound","description":"404日志","stars":0,"language":"HTML","topics":[],"url":"https://github.com/TsangHaotian/404BlogFound"},{"name":"CardGameYS","description":"隐私政策","stars":0,"language":"其他","topics":[],"url":"https://github.com/TsangHaotian/CardGameYS"},{"name":"Harmony_EyesNote","description":"鸿蒙应用眨眼笔记","stars":0,"language":"Harmony","topics":[],"url":"https://github.com/TsangHaotian/Harmony_EyesNote"},{"name":"GaokaoHelper","description":"AI大语言模型多角色对话工具，专注高考志愿填报辅助","stars":0,"language":"HTML","topics":[],"url":"https://github.com/TsangHaotian/GaokaoHelper"},{"name":"openclaw-css-tweaker","description":"openclaw前端修改器","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/openclaw-css-tweaker"},{"name":"JRXY-AutoSign-Reborn","description":"今日校园自动化签到","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/JRXY-AutoSign-Reborn"},{"name":"Software_Libraries","description":"一些本人收藏的软件","stars":0,"language":"其他","topics":[],"url":"https://github.com/TsangHaotian/Software_Libraries"},{"name":"RocoKingdomTranslator","description":"洛克王国语翻译器","stars":6,"language":"HTML","topics":[],"url":"https://github.com/TsangHaotian/RocoKingdomTranslator"},{"name":"Python_Visual_Focus_Training_System","description":"视觉专注训练系统","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/Python_Visual_Focus_Training_System"},{"name":"DrawAnythingToYakiji","description":"画什么都变成鸭吉吉","stars":0,"language":"HTML","topics":[],"url":"https://github.com/TsangHaotian/DrawAnythingToYakiji"},{"name":"YajijiOracle","description":"鸭吉吉答案之书","stars":0,"language":"HTML","topics":[],"url":"https://github.com/TsangHaotian/YajijiOracle"},{"name":"4C_competition","description":"计算机设计大赛","stars":0,"language":"AI大模型微调","topics":[],"url":"https://github.com/TsangHaotian/4C_competition"},{"name":"web_happybirthday","description":"网页生日快乐","stars":0,"language":"HTML","topics":[],"url":"https://github.com/TsangHaotian/web_happybirthday"},{"name":"Android_login","description":"第一次登录界面作业","stars":0,"language":"Android","topics":[],"url":"https://github.com/TsangHaotian/Android_login"},{"name":"python_word_to_excel","description":"py处理文档","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/python_word_to_excel"},{"name":"python_Job_Check_tool","description":"作业检查工具","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/python_Job_Check_tool"},{"name":"python_pdf_to_word","description":"pdf转word","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/python_pdf_to_word"},{"name":"Android_login_and_jigsaw_puzzle","description":"登录界面和拼图","stars":0,"language":"Android","topics":[],"url":"https://github.com/TsangHaotian/Android_login_and_jigsaw_puzzle"},{"name":"Android_Calculators","description":"安卓计算器app","stars":6,"language":"Android","topics":[],"url":"https://github.com/TsangHaotian/Android_Calculators"},{"name":"python_Excel_merge_tool","description":"excel合并工具","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/python_Excel_merge_tool"},{"name":"Android_Mental_health_program","description":"心理健康应用app","stars":0,"language":"Android","topics":[],"url":"https://github.com/TsangHaotian/Android_Mental_health_program"},{"name":"Python_Probability_theory_gambling_game","description":"赌博模拟警示程序","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/Python_Probability_theory_gambling_game"},{"name":"Python_Interactive_somatosensory_operation","description":"交互性体感操控","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/Python_Interactive_somatosensory_operation"},{"name":"Su-Shi-dingfengbo-poems-fine-tuning-AI-model","description":"基于deepseek-7B-Chat苏轼定风波微调大模型","stars":0,"language":"AI大模型微调","topics":[],"url":"https://github.com/TsangHaotian/Su-Shi-dingfengbo-poems-fine-tuning-AI-model"},{"name":"python_ppt_assistant","description":"古诗词ppt讲解助手","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/python_ppt_assistant"},{"name":"Python_data_merge_tool","description":"excel数据合并工具","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/Python_data_merge_tool"},{"name":"Python_Probability_theory_gambling_game_V2.0","description":"赌博游戏2.0","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/Python_Probability_theory_gambling_game_V2.0"},{"name":"python_40_Parallel_College_Volunteering_for_C","description":"40个平行志愿高考模拟系统","stars":5,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/python_40_Parallel_College_Volunteering_for_C"},{"name":"Web_Truth_or_dare","description":"可控真心话大冒险","stars":0,"language":"HTML","topics":[],"url":"https://github.com/TsangHaotian/Web_Truth_or_dare"},{"name":"Web_Find_a_difference","description":"找不同","stars":0,"language":"HTML","topics":[],"url":"https://github.com/TsangHaotian/Web_Find_a_difference"},{"name":"Web_Person","description":"个人网页","stars":0,"language":"HTML","topics":[],"url":"https://github.com/TsangHaotian/Web_Person"},{"name":"Web_Xinjiang_Foods","description":"新疆的美食网页设计","stars":0,"language":"HTML","topics":[],"url":"https://github.com/TsangHaotian/Web_Xinjiang_Foods"},{"name":"Python_mind_project","description":"情绪识别与AI对话系统","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/Python_mind_project"},{"name":"WChatXiaochengxuYun_jizhangben","description":"微信小程序记账本（云开发）","stars":0,"language":"微信小程序","topics":[],"url":"https://github.com/TsangHaotian/WChatXiaochengxuYun_jizhangben"},{"name":"WChatXiaoChengxu_jizhangben","description":"微信小程序开发记账本","stars":0,"language":"微信小程序","topics":[],"url":"https://github.com/TsangHaotian/WChatXiaoChengxu_jizhangben"},{"name":"Organizing_the_computer_desktop","description":"电脑桌面整理","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/Organizing_the_computer_desktop"},{"name":"python_web_Question_Bank_Assistant","description":"线上刷题网站","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/python_web_Question_Bank_Assistant"},{"name":"Python_hand_language_web","description":"手语识别半成品","stars":0,"language":"Python","topics":[],"url":"https://github.com/TsangHaotian/Python_hand_language_web"}];

const EMBEDDED_POSTS = [];

function isFileProtocol() {
  return window.location.protocol === 'file:';
}

// 获取项目列表
async function fetchRepos() {
  if (isFileProtocol()) return EMBEDDED_PROJECTS;
  const resp = await fetch('data/projects.json');
  if (!resp.ok) throw new Error('加载项目数据失败');
  return resp.json();
}

// 获取博客文章列表（只返回标题和摘要，不返回正文）
async function fetchPosts() {
  if (isFileProtocol()) return EMBEDDED_POSTS;
  const resp = await fetch('data/posts.json');
  if (!resp.ok) return [];
  const posts = await resp.json();
  // 去掉正文，只保留元数据
  return posts.map(p => ({
    id: p.id, title: p.title, date: p.date,
    tags: p.tags, description: p.description, url: p.url
  }));
}

// 获取单篇文章（从 GitHub API 直接拉取原文，避免 JSON 转义问题）
async function fetchPost(id) {
  // 先用 fetchPosts 获取元数据
  const posts = await fetchPosts();
  const meta = posts.find(p => p.id == id);
  if (!meta) return null;

  // 从 GitHub API 拉取 Issue 原文（用 raw 格式，不走 JSON 解析）
  try {
    const resp = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/issues/${id}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!resp.ok) {
      // API 失败时用本地的兜底
      const localResp = await fetch('data/posts.json');
      const allPosts = await localResp.json();
      const full = allPosts.find(p => p.id == id);
      return full || null;
    }
    const issue = await resp.json();
    return {
      id: issue.number,
      title: issue.title,
      date: issue.created_at.slice(0, 10),
      tags: issue.labels.filter(l => l.name !== 'blog').map(l => l.name),
      description: meta.description,
      body: issue.body || '',
      url: issue.html_url
    };
  } catch(e) {
    // API 失败时用本地的兜底
    const localResp = await fetch('data/posts.json');
    const allPosts = await localResp.json();
    const full = allPosts.find(p => p.id == id);
    return full || null;
  }
}
