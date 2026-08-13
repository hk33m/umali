import React from 'react';

const OurStory = () => {
  return (
    <section className="py-10 bg-orange-50/50" id={"story"} dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-orange-100 relative overflow-hidden">
          
          {/* زخرفة خفيفة في الخلفية */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full opacity-50" />
          
          <div className="relative z-10 text-center">
            {/* أيقونة تعبر عن الخبز أو الحب */}
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🥖</span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-4">
              قصة <span className="text-primary">مخبز أم علي</span>
            </h2>

            <div className="space-y-6 text-gray-600 text-sm md:text-base leading-relaxed">
              <p>
                بدأت حكاية أم علي من شيء بسيط نعرفه جميعًا…
                <br />
                رائحة الخبز وهي تملأ البيت، ويد أمٍّ تصنع الطعام لأهلها بحب.
              </p>
              
              <p className="bg-orange-50 p-6 rounded-2xl border-r-4 border-primary text-gray-700 ">
                ومن هنا جاءت فكرتنا: أن نأخذ تلك النكهة التي تربينا عليها، ونقدمها لكم في مخبوزات تُحضّر من البر الصحي وبأيدي أمهات يضعن في كل قطعة شيئًا من خبرتهن وحنانهن.
              </p>

              <div className="pt-6 border-t border-gray-100 ">
                <p className="font-bold text-gray-800 text-xl md:text-2xl ">
                  مخبز أم علي ليس مجرد مخبز…
                </p>
                <p className="text-orange-600 font-black text-sm md:text-base   mt-2">
                  إنه نكهة البيت، في كل لقمة. ❤️
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;