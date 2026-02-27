const fs = require('fs');
const pdf = require('pdf-parse');
const { createClient } = require('@supabase/supabase-js');

// استبدل الروابط ببياناتك الصحيحة من الصور 16 و 17
const supabase = createClient('https://rykcxpteebirfbvrklfn.supabase.co', 'sb_publishable_e6ynvoxdZkUW2DSYqIKF_w_D4Un_...');

async function uploadBook(fileName, title, track) {
    const filePath = `./books/${fileName}`;
    const dataBuffer = fs.readFileSync(filePath);

    console.log(`⏳ جاري قراءة كتاب: ${title}...`);

    pdf(dataBuffer).then(async function(data) {
        // تقسيم الكتاب بناءً على فواصل الصفحات
        const pages = data.text.split(/\f/);

        for (let i = 0; i < pages.length; i++) {
            const content = pages[i].trim();
            if (content.length > 100) { // تخطي الصفحات شبه الفارغة
                const { error } = await supabase
                    .from('curriculum_docs')
                    .insert([
                        {
                            content: content,
                            book_title: title,
                            track: track,
                            grade: '1 ثانوي',
                            page_number: i + 1
                        }
                    ]);

                if (error) console.error(`❌ خطأ في الصفحة ${i+1}:`, error.message);
                else console.log(`✅ تم رفع الصفحة ${i+1}`);
            }
        }
        console.log(`✨ اكتمل رفع كتاب ${title} بنجاح!`);
    });
}

// تشغيل الرفع - تأكد من مطابقة اسم الملف لما رفعته في مجلد books
uploadBook('physics_1as.pdf', 'الفيزياء', 'علوم وتكنولوجيا');
