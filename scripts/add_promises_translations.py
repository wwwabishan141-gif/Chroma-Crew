import json

promises_en = {
  "badge": "Built Different",
  "title": "Uncompromising Quality Standards",
  "subtitle": "We don't build generic basics. Every drop is crafted to become your go-to fit.",
  "f1_title": "Heavyweight Cotton",
  "f1_desc": "Sourced locally and pre-shrunk for the perfect boxy drape. Real heavyweight fabrics (240+ GSM) that stand the test of time.",
  "f1_badge": "240+ GSM",
  "f2_title": "High-Fidelity Graphics",
  "f2_desc": "Vibrant pigment inks fused directly into the fabric. Deep colors, a soft hand feel, zero plasticky shine, and no wash-out cracking.",
  "f2_badge": "FADE-RESISTANT",
  "f3_title": "Cash on Delivery",
  "f3_desc": "Pay cash at your door with absolute peace of mind. Shipped via trusted local riders with next-day dispatch in Colombo.",
  "f3_badge": "COD Available",
  "f4_title": "Streetwear Fit Guarantee",
  "f4_desc": "Drape is everything. If your graphic tee isn't styled exactly how you imagined, we offer a hassle-free 7-day size exchange.",
  "f4_badge": "EASY RETURNS",
  "trust1": "100% Sri Lankan Made",
  "trust2": "Ethically Sourced",
  "trust3": "Streetwear Authenticity",
  "readManifesto": "Read the Manifesto"
}

promises_si = {
  "badge": "වෙනස් ලෙස නිර්මාණය කර ඇත",
  "title": "නොසැලෙන ගුණාත්මක ප්‍රමිතීන්",
  "subtitle": "අපි සාමාන්‍ය දේවල් නිර්මාණය කරන්නේ නැහැ. සෑම නිර්මාණයක්ම ඔබේ ප්‍රියතම ඇඳුම වීමට සකසා ඇත.",
  "f1_title": "බරැති කපු",
  "f1_desc": "දේශීයව ලබාගත් සහ නිවැරදි හැඩය සඳහා පෙර-හැකිලූ. කාලයට ඔරොත්තු දෙන සැබෑ බරැති රෙදි (240+ GSM).",
  "f1_badge": "240+ GSM",
  "f2_title": "ඉහළ ගුණාත්මක ග්‍රැෆික්ස්",
  "f2_desc": "වර්ණවත් තීන්ත රෙදිවලටම කාවැදී ඇත. ගැඹුරු වර්ණ, මෘදු ස්වභාවය, ප්ලාස්ටික් දිලිසීමක් නැත, සේදීමේදී ඉරිතැලීම් නැත.",
  "f2_badge": "මැකී නොයන",
  "f3_title": "මුදල් ගෙවා ලබා ගැනීම",
  "f3_desc": "සම්පූර්ණ මනසේ සාමය සහිතව ඔබේ දොරකඩදීම මුදල් ගෙවන්න. කොළඹදී ඊළඟ දවසේ යැවීම සමඟ විශ්වාසදායක දේශීය බෙදාහරින්නන් හරහා යවනු ලැබේ.",
  "f3_badge": "COD ලබා ගත හැකි",
  "f4_title": "ස්ට්‍රීට්වෙයාර් ගැළපුම් සහතිකය",
  "f4_desc": "හැඩය තමයි වැදගත්ම. ඔබේ ග්‍රැෆික් ටී-ෂර්ට් එක ඔබ සිතූ ආකාරයටම නැත්නම්, අපි දින 7ක පහසු ප්‍රමාණ මාරු කිරීමක් ලබා දෙන්නෙමු.",
  "f4_badge": "පහසු ප්‍රතිලාභ",
  "trust1": "100% ශ්‍රී ලාංකික නිෂ්පාදනයක්",
  "trust2": "සදාචාරාත්මකව ලබා ගත්",
  "trust3": "ස්ට්‍රීට්වෙයාර් සත්‍යතාව",
  "readManifesto": "අපගේ ප්‍රතිපත්ති කියවන්න"
}

promises_ta = {
  "badge": "வித்தியாசமாக உருவாக்கப்பட்டது",
  "title": "சமரசமற்ற தரத் தரநிலைகள்",
  "subtitle": "நாங்கள் சாதாரணமானவற்றை உருவாக்குவதில்லை. ஒவ்வொரு வடிவமைப்பும் உங்களுக்குப் பிடித்தமானதாக மாறவே உருவாக்கப்பட்டுள்ளது.",
  "f1_title": "கனமான பருத்தி",
  "f1_desc": "உள்ளூரில் பெறப்பட்டு சரியான வடிவத்திற்காக முன்கூட்டியே சுருக்கப்பட்டது. காலத்தை தாங்கும் உண்மையான கனமான துணிகள் (240+ GSM).",
  "f1_badge": "240+ GSM",
  "f2_title": "உயர்தர கிராபிக்ஸ்",
  "f2_desc": "துணியுடன் நேரடியாக இணைக்கப்பட்ட துடிப்பான மை. ஆழமான நிறங்கள், மென்மையான தன்மை, பிளாஸ்டிக் பளபளப்பு இல்லை, மற்றும் சலவையில் வெடிப்புகள் இல்லை.",
  "f2_badge": "மங்காது",
  "f3_title": "பணம் ஒப்படைப்பு",
  "f3_desc": "முழுமையான மன அமைதியுடன் உங்கள் வாசலிலேயே பணம் செலுத்துங்கள். கொழும்பில் அடுத்த நாள் அனுப்புதலுடன் நம்பகமான உள்ளூர் விநியோகஸ்தர்கள் மூலம் அனுப்பப்படுகிறது.",
  "f3_badge": "பணம் ஒப்படைப்பு கிடைக்கிறது",
  "f4_title": "ஸ்ட்ரீட்வேர் பொருத்தம் உத்தரவாதம்",
  "f4_desc": "வடிவமைப்பே முக்கியம். உங்கள் கிராஃபிக் டி-ஷர்ட் நீங்கள் நினைத்தபடி இல்லை என்றால், 7 நாள் அளவு மாற்றுவதற்கான வாய்ப்பை நாங்கள் வழங்குகிறோம்.",
  "f4_badge": "எளிதான திருப்பங்கள்",
  "trust1": "100% இலங்கையில் தயாரிக்கப்பட்டது",
  "trust2": "நெறிமுறையாக பெறப்பட்டது",
  "trust3": "ஸ்ட்ரீட்வேர் நம்பகத்தன்மை",
  "readManifesto": "எங்கள் கொள்கைகளைப் படிக்கவும்"
}

def update_locale(filename, promises):
    with open(f"messages/{filename}", "r", encoding="utf-8-sig" if filename == "si.json" else "utf-8") as f:
        data = json.load(f)
    data["Promises"] = promises
    with open(f"messages/{filename}", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_locale("en.json", promises_en)
update_locale("si.json", promises_si)
update_locale("ta.json", promises_ta)

print("Promises locale files updated successfully")
