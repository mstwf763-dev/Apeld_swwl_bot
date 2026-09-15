const TelegramBot = require('node-telegram-bot-api');

// توكن البوت الخاص بك
const token = '8767886786:AAEMdZd7tWU97ijufd20girTEKXpAuQwbp8';

// تشغيل البوت بنظام Polling
const bot = new TelegramBot(token, { polling: true });

console.log("البوت يعمل الآن بنظام Polling بنجاح...");

// الرد عند إرسال أمر /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "أهلاً بك! قم بإرسال أي ملف PDF أو مستند وسأقوم بتوليد رابط تحميل مباشر له فوراً.");
});

// معالجة وإرجاع رابط المستندات والملفات
bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  const fileId = msg.document.file_id;
  const fileName = msg.document.file_name || "ملف_بدون_اسم.pdf";

  try {
    // جلب مسار الملف المباشر من سيرفرات تلغرام
    const file = await bot.getFile(fileId);
    const downloadUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    // إرسال النص العادي لتفادي أخطاء أسماء الملفات العربية والرموز
    const reply = `📄 اسم الملف:\n${fileName}\n\n🔗 رابط التحميل المباشر:\n${downloadUrl}`;

    await bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error("خطأ:", error);
    bot.sendMessage(chatId, "حدث خطأ أثناء جلب رابط الملف. يرجى المحاولة مرة أخرى.");
  }
});
