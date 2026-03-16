import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar as RNStatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { BOOKS } from '../../constants/subjects';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Full story data content
const STORY_CONTENT = {
  b1: {
    paragraphs: [
      "Alkisah di suatu lembah yang subur di Sumatra Utara, hiduplah seorang pemuda bernama Toba. Ia adalah seorang yatim piatu yang bekerja keras sebagai petani dan nelayan. Kehidupannya teramat sederhana dan sepi, ditemani gemericik air sungai tempatnya mencari ikan setiap senja.",
      "Suatu hari, setelah berjam-jam lamanya kailnya tak tersentuh, tiba-tiba pancingnya disambar dengan kuat. Dengan seluruh tenaganya, Toba menarik tali pancingnya ke darat. Betapa terkejutnya ia mendapati seekor ikan mas berukuran sangat besar, bersisik kuning keemasan yang memantulkan sinar matahari sore. Toba sangat gembira, membayangkan santapan lezat yang akan ia nikmati.",
      "Namun keanehan terjadi saat Toba melepaskan mata pancing. Ikan mas itu tiba-tiba mengubah wujudnya! Asap putih mengepul, dan perlahan sosok sisik emas itu berubah menjadi seorang gadis cantik jelita dengan rambut hitam panjang terurai dan gaun keemasan. Toba sampai jatuh terduduk saking terkejutnya.",
      "\"Terima kasih, Tuan, karena telah tidak memakanku,\" ujar sang putri dengan suara lembut. \"Sebagai balas budi karena Tuan telah menyelamatkan nyawaku, aku bersedia menjadi istrimu dan mengabdi selamanya.\"",
      "Toba yang memang sudah lama memendam rasa kesepian, langsung mengiyakan tanpa pikir panjang. Tentu saja, siapa yang akan menolak tawaran dari peri secantik itu? Namun, sang putri menatap mata Toba dalam-dalam dan memberikan satu syarat yang sangat mutlak.",
      "\"Tuan, Anda boleh menikahiku, tapi berjanjilah satu hal. Tolong rahasiakan asal-usulku. Jangan pernah sekali-kali, walau dalam keadaan marah sekalipun, Tuan menyebutku atau merendahkanku dengan kata-kata 'keturunan ikan'. Jika janji itu dilanggar, maka petaka besar akan terjadi.\"",
      "Toba mengangguk mantap dan berjanji. Mereka pun menikah dan hidup bahagia. Setahun kemudian, kebahagiaan mereka bertambah dengan lahirnya seorang bayi laki-laki yang diberi nama Samosir.",
      "Seiring berjalannya waktu, Samosir tumbuh menjadi anak yang lincah dan sehat. Akan tetapi, ada satu sifat yang sangat menonjol dari Samosir: ia tak pernah merasa kenyang. Nafsu makannya luar biasa. Ia sering menghabiskan jatah makanan yang seharusnya diperuntukkan bagi ayahnya yang sudah lelah bekerja di ladang.",
      "Suatu hari, ibu Samosir menyuruh anaknya mengantarkan bekal makan siang untuk ayahnya yang sedang sibuk memanen singkong. Saat di perjalanan, aroma lauk pauk yang menggugah selera membuat Samosir tak tahan. Ia pun berhenti di bawah pohon rindang dan melahap hampir seluruh isi rantang tersebut, hanya menyisakan tulang-tulang ikan dan sedikit nasi sisa.",
      "Sesampainya di ladang, Toba sudah kelelahan dan sangat kelaparan. Ketika membuka rantang tersebut, wajah Toba memerah padam melihat isinya hanya sisa tulangan. Emosinya memuncak. Rasa lelah, panas matahari terik, dan perut keroncongan membuatnya kehilangan kendali atas lisannya.",
      "\"Dasar anak sialan! Tidak tahu diuntung! Memang benar kau ini anak keturunan ikan!!\" teriak Toba penuh amarah sambil menampar Samosir.",
      "Mendengar bentakan ayahnya, Samosir menangis tersedu-sedu dan berlari pulang. Ia menceritakan rentetan makian ayahnya kepada sang ibu. Mendengar itu, ibunya sangat bersedih. Ia tahu bahwa janji suci mereka telah dilanggar, dan petaka tidak bisa dihindarkan lagi.",
      "Di tengah tangisnya, ibu Samosir menyuruh anaknya berlari sekencang mungkin ke bukit tertinggi yang ada di desa itu. Samosir yang ketakutan langsung patuh dan memanjat bukit tertinggi.",
      "Sesaat setelah Samosir pamit berlari, kilat menyambar dan langit tiba-tiba berubah gelap gulita. Awan hitam pekat menggulung, dan hujan badai turun dengan sangat deras tiada henti. Tak lama setelah itu, dari tapak kaki ibu Samosir saat ia berdiri menangis, menyembur mata air yang sangat deras bagaikan semburan air bah.",
      "Sang ibu secara perlahan kembali berubah wujud menjadi ikan mas emas, menyelam dalam arus banjir tersebut. Toba yang sedang berlari pulang dari ladangnya pun tak sempat menyelamatkan diri, ia tertelan pusaran air yang terus meninggi merendam seluruh desa dan lembah itu.",
      "Air itu semakin luas hingga membentuk sebuah danau raksasa. Danau yang menenggelamkan masa lalu Toba itu kemudian dinamai masyarakat sebagai Danau Toba. Pelajaran dari cerita ini: Tepati dan hargai janji yang telah Anda buat, karena kata-kata yang diucapkan tidak akan pernah bisa ditarik kembali."
    ]
  },
  b2: {
    paragraphs: [
      "Di sebuah hutan yang lebat dan rimbun, hidup sekumpulan binatang yang rukun. Namun di antara mereka semua, Si Kancil selalu menjadi buah bibir. Meski tubuhnya sangat kecil, akalnya jauh lebih berharga daripada kekuatan puluhan gajah. Kancil terkenal cerdik dan pandai berbicara untuk keluar dari berbagai kepelikan.",
      "Di suatu pagi kemarau yang sangat terik, sinar matahari terasa membakar kulit Kancil. Sumur-sumur air mengering, rumput-rumput hijau berubah kekuningan. Perut Kancil berbunyi nyaring saking laparnya. \"Ah, sepertinya aku harus menjelajah agak jauh untuk mencari makan hari ini,\" batin Kancil sambil melangkahkan kakinya.",
      "Setelah sekian lama menyusuri padang tandus, mata Kancil berbinar terang. Di kejauhan, terbentang sungai yang airnya masih lumayan deras. Dan hal yang membuat Kancil paling gembira adalah... di seberang sungai sana, berjejer rapi pepohonan mentimun liar dan rambutan yang buahnya sangat merah merona menunggu dipetik!",
      "\"Wah... beruntungnya nasibku. Surga makanan ada di depan mata!\" seru Kancil dengan girang.",
      "Namun, kegembiraan itu langsung memudar ketika Kancil menghitung lebar sungai itu. Arus di tengahnya sangat kuat, dan ia tahu betul ia tak mahir berenang melawan arus yang berputar kencang. Jika ia nekat, tubuh kecilnya bisa hanyut ke lautan luas.",
      "Tiba-tiba, dari permukaan air menyembul gelembung besar. Muncullah kepala mengerikan dengan sisik hijau bergerigi dan gigi-gigi tajam yang siap mencabik apapun. Buaya!",
      "Sang Buaya menatap Kancil yang malang dengan mata berbinar lapar. \"Aha! Santapan siang gratis datang dengan sendirinya ke tepi sungai. Bersiaplah jadi perkedel Kancil!\" ancam sang Buaya.",
      "Jantung Kancil berdegup kencang, nyaris melompat dari dadanya. Tapi ia cepat-cepat menenangkan diri. Ia tahu tak ada gunanya menantang adu otot dengan sang predator.",
      "Kancil berdehem mengatur suaranya agar terdengar berwibawa. \"Tunggu dulu wahai Buaya sahabat lamaku! Aku sama sekali tidak takut dimakan. Justru, aku ke mari membawa kabar gembira yang sangat menguntungkan untuk dirimu dan seluruh kawanmu di seantero muara!\"",
      "Sang Buaya yang penasaran urung membuka rahangnya. \"Kabar apa maksudmu hewan kerdil? Jangan coba-coba menipuku!\"",
      "\"Aku baru saja diutus oleh Paduka Raja Hutan, sang Singa agung yang berkuasa,\" ucap Kancil meyakinkan. \"Paduka Singa sedang merayakan pesta khitanan anak bungsu kerajaannya dan akan membagikan ransum daging segar satu ton kepada kalian golongan reptil air!\"",
      "Mata sang Buaya membesar. Mendengar kata 'daging gratis satu ton', air liurnya sontak menetes jatuh. \"Be... benarkah? Bagaimana caranya aku bisa mendapatkan jatah daging bangsawan itu?\"",
      "\"Tentu saja ada prosedurnya. Paduka Raja memintaku untuk menghitung jumlah total buaya yang ada di sungai ini untuk menyesuaikan takaran pembagian paket daging gulingnya. Jika ada yang terlewat, aku yang akan dihukum pancung,\" kata Kancil sambil berlagak mencatat di telapak tangannya.",
      "Sang Buaya langsung terjun memanggil semua teman-teman, adik, kakak, paman, dan bibinya dari dalam perairan gelap nan keruh.",
      "\"Perhatian! Teman-teman berbarislah dari sisi sini sampai menyeberangi hulu sebelah sana! Tuan Kancil utusan Paduka akan mensensus jumlah kita! Cepat baris jangan saling dorong!\" teriak buaya pelopor tersebut. Dalam sekejap, puluhan buaya berjejer rapi membentangkan sebuah 'jembatan hidup' yang membentang menyeberangi sungai hingga menyentuh tepi daratan tempat kebun mentimun itu berada.",
      "\"Baiklah, hitungan dimulai, jangan ada yang bergerak agar aku tidak salah ketik!\" kata Kancil sambil melompat mantap ke punggung buaya pertama.",
      "\"...Satu!\" Kancil melompati punggung berbonggol yang lain.",
      "\"...Dua, tiga! Bagus, terus berjajar lurus!\"",
      "\"...Empat, lima, enam! Wah banyak juga keluargamu ya... Tujuh, lapan, sembilan, sepuluh! Selesai!\"",
      "Kancil baru mengucapkan kata 'selesai' setelah tapak kakinya mendarat dengan aman di pinggir tebing berumput hijau, tepat selangkah dari pepohonan mentimun yang menggiurkan. Ia mendarat mulus layaknya pesenam pro.",
      "Buaya-buaya yang mendongak penasaran memprotes, \"Hei! Jadi totalnya ada sepuluh? Mana daging kami sekarang, Cil?!\"",
      "Sambil memetik sebuah mentimun dan mengunyah pelan, Kancil tertawa cekikikan meledek si sekawanan reptil polos itu. \"Daging satu ton apanya! Kalian benar-benar reptil tidak baca koran, ya? Paduka Singa itu lagi diet dan sedang masa panen seledri, mana mungkin membagi-bagikan daging! Terima kasih ya ojek sungainya, berkat punggung bersisik kalian kakiku malah tidak basah air setitik pun! Hahahaha!\"",
      "Buaya-buaya merasa seamat marah. Mereka menggeram luar biasa keras sembari menghempaskan ekor-ekornya menebas air karena ditipu bulat-bulat. Sayangnya, Kancil telah aman bersembunyi di rimbunnya hutan menikmati hadiah manis berupa buah buahan dengan santai.",
      "Dari sanalah, pepatah Indonesia mencatat, selicik-liciknya akal cerdik, pastikan digunakan di saat kritis. Namun tentu saja buaya setelah peristiwa itu, jadi tidak pernah akur lagi dengan seluruh kerabat keturunan kancil."
    ]
  },
  b3: {
    paragraphs: [
      "Di sebuah desa makmur bernama Daha, hiduplah Sidi Mantra yang sakti luar biasa. Selain diberkahi kebijaksanaan, ia kaya raya dan hartawan kelas atas. Namun sayangnya, putranya tunggalnya yang bernama Manik Angkeran justru terlahir memiliki kegemaran berjudi yang amat masif. Manik suka bertaruh di adu ayam hingga hartanya habis dan terus-menerus terjerat hutang renternir.",
      "Suatu saat, Manik dikejar sekumpulan lintah darat. Tak berdaya, ia merengek pada ayahnya. Karena sayang anak, Sidi Mantra bersemedi. Suara gaib memerintahkannya menuju Gunung Agung menjumpai sang Naga Besukih yang tubuhnya dilapisi sisik intan berlian bernilai miliaran. Sidi menuju sana dengan lonceng suci, mendentingkannya sambil membaca mantra kuno.",
      "Sang Naga Besukih yang legendaris pun muncul. Atas dasar kasih persahabatan, naga raksasa itu sedikit melepaskan rontokan sisik emasnya bagi Sidi untuk dikonversi menjadi perhiasan lunasi utang si anak malang tersebut.",
      "Akan tetapi, bukannya taubat, ketika hutangnya beres Manik Angkeran malah kembali terjun di dunia malam untuk foya-foya berjudi hingga hartanya tandas lagi.",
      "Demi mengetahui sumber kekayaan misterius itu berasal dari Naga Besukih, si Manik nekat mencuri genta ajaib ayahnya menuju ke Gunung Agung. Disana ia membunyikan genta. Memang benar, Naga Besukih yang lugu dan ramah keluar.",
      "\"Ah kamu kan anak dari sahabat karibku Sidi Mantra... ada kesulitan apa lagi kalian? Baiklah, akan kuberi secuil keping emasku lagi,\" kata si naga dengan mata agak mengantuk karena usia. Sang Naga pun berputar berencana menjatuhkan keping dari balik ekornya.",
      "Sifat tamak merasuki otak Manik Angkeran. Ketika si naga berputar mundur membelakanginya, terlihat segumpal ujung ekor yang terdiri ataskan batu ruby semerah darah terbesar di dunia. Gelap mata, Manik menebaskan pedang besarnya dengan niat mencuri seluruh potongan ekor dewa itu! Kraash!!",
      "Sang naga menjerit nyaring dan kepalanya berputar dengan amarah mendidih. Belum sempat Manik Angkeran menyarungkan potongan intan tersebut lalu lari kabur, semburan api biru dari nafas naga raksasa itu membakar mati Manik dalam sekejap detik hingga tak tersisa melainkan abu arang di tanah berbatu.",
      "Mengetahui tragedi tak terelakkan itu, Sidi Mantra memohon pada sang naga. Tolong pertemukan tulang dan abu anaknya dan hidupkan sekali lagi nyawanya, dan sebagai syarat Sidi akan menyegel ekor naganya supaya kembali normal seutuhnya. Sepakatlah mereka.",
      "Manik Angkeran berhasil dihidupkan dengan keajaiban supranatural. Saat itu menangislah Manik tersedu merangkul memohon maaf dari kaki ayahnya. Ia bersumpah akan sadar dan bersikap bermartabat. Namun cinta ayahnya berkalang dengan objektivitas logis. Sidi sadar lingkungan masa lalunya harus diputus agar Manik tidak kambuh pada kawan-kawan judi lamanya.",
      "Sidi Mantra kemudian menggunakan tongkat saktinya untuk menggores daratan di antara titik tempat mereka berdiri sehingga pulau panjang itu terputus. Goresan tongkat saktinya membelah pulau besar nan memanjang, yang kelak dikenal sebagai Jawa, dan patahan sisinya menjadi selat lautan biru nan dalam yang tidak sanggup diarungi perenang manapun.",
      "Potongan pulau hasil pecahan kutukan itu kini dinamakan Pulau Bali, tempat eksil Manik Angkeran bertaubat dan membangun era kultur rohani yang baru, terpisah aman dari pergaulan buram daratan lamanya oleh arus abadi membelah yakni Selat Bali."
    ]
  },
  b4: {
    paragraphs: [
      "Disebutkan, seorang ibu janda bernama Mbok Srini, dirundung gundah bertahun-tahun meratapi nasibnya tak diberikan keturunan walau telah lanjut usia renta.",
      "Dalam kesedihan ekstrem, Mbok Srini memanjatkan rintihan lirih menuju kekosongan hutan, memohon diberi takdir secercah kehidupan anak manusia. Sayangnya, erangan frustasinya justru mengundang kedatangan mahluk astral, Buto Ijo sang raksasa mengerikan berwarna hijau kelam pelahap manusia.",
      "\"Telingaku berdengung oleh tangismu yang menyedihkan wanita ringkih! Jika kau sangat tergila-gila atas penerus keturunan... ambillah sebuah biji mentimun saktiku ini!\" raung Buto Ijo, memberikan biji bercahaya kekuningan kepada Mbok Srini.",
      "\"Tapi tak ada gratis mutlak dalam keajaiban duniaanku. Saat bayi perempuan dari timun ini kelak berusia pas 17 tahun dan mekar sempurna layaknya persik matang, kau harus merelakannya untuk disantap telan bukat di kerongkonganku. Sepakat, perempuan tua?\"",
      "Terbutakan oleh fana keinginan melahirkan, Mbok Srini spontan mengangguk dan merestui pakta sihir hitam tersebut. Ajaib memang. Setelah ditanam, pohon ketimun subur mendadak merambat hingga sebongkah kulit mentimun berwarna emas mekar bercahaya emas. Di dalamnya... terbaringlah bayi wanita mungil! Itulah si Timun Emas atau yang kini disebut Timun Mas.",
      "Menjelang ulang tahun usianya ke-17 di masa gadis muda, kegundahan luar biasa kronik menggelayut di benak Mbo Srini ketika mengingat sumpah konyol di perjanjian aslinya itu. Semalam sebelum ulang tahun mematikan itu jatuh, Mbok bermimpi disuruh ke puncak bukit tua mencari seorang kyai pertapa legendaris.",
      "Sang Pertapa mengkonfirmasi niat jahat Buto Ijo. Mbo Srini menangis mengemis memohon resep untuk perlawanan nyawa anaknya kelak. Diberikanlah empat racikan magis pamungkas: satu genggam bibit timun murni, sepenggal jarum, setetes garam sakti, dan sepercik terasi merah. \"Masing-masing bungkusan ini letakkan di saku putri emasmu esok kelak,\" ujar sang Kyai bijak menatap ke relung jiwa kekhawatiran si janda.",
      "Keesokan fajar, gempa mini mengoyak pedesaan. Pintu dihempas paksa ambruk, mendatangkan siluet kolosal Buto Ijo bermata rubi mendidih merah menagih janji berdarah. Sang ibu nekat menipu menyuruh Timun Mas berlari terbirit ke kelebatan hutan terlarang belakang halaman mereka.",
      "Mengetahui santapannya dikacaukan durasi tunggu, si Raksasa berlari laksana peluru meteor mengejar siluet perawan yang kabur di pelaratan pepohonan liar timur laut hutan.",
      "Timun mas lari histeris ketakutan. Hampir saja cakar beringas nan jelek si monster mencaplok rambutnya, sang gadis melempar barang perdana dari saku nya... segenggam benih mentimun sakti!",
      "Hutan bergetar. Tanah tempat benih ditebar mendadak pecah merayapkan lautan rimbun tanaman tajam pelilit. Akar timun berduri kuat nan merayap menjerat langkah sang predator. Buto Ijo menyumpah liar selagi mencacah sulur mentimun raksasa tersebut dan berhasil membebaskan diri setelah beberapa menit tertahan.",
      "Kedua kalinya, Buto menempel jarak sedepa, terhembus nafas panas mengeringkan tengkuk Timun Mas. Gadis malang itu seketika menabur perbekalan keduanya: genggaman jarum sakt!",
      "Begitu jarum tajam berlabuh ke tanah berlumpur, ratusan batang pohon dari bambu tajam tombak bertebaran seketika setinggi tebing menembus dan menusuk menyayat kulit hijau sang rasaksa rawa! Raungan tangis sakit Buto Ijo membelah langit mengucurkan darah hijau legam, walau ironis tenaga super aslinya meledakkan tatanan bilah bambu demi melanjutkan manuver santapannya yang ditenggarai marah tiada ujung.",
      "Akselerasi pengejaran Raksasa tak wajar. Cakar sudah memoles tipis ujung baju merah gadis belia sebelum melempar serbuk serbuk asing, Taburan Garam! Pemandangan spektakuler bak ledakan alam ajaib tercipta.. radius tanah berubah mendadak jadi genangan lautan asin berpalung dalam yang bergulung-gulung seukuran ombak Tsunami menjebak monster tersebut menyamput paru-paru besarnya, harus kembali berjuang merenangi samudra magis sesaat.",
      "Tapi teror sihir itu melumpuhkan sesaat. Nafas Raksasa melampaui logika biologi. Buto muncul di cakrawala menyeka lautan, terbatuk tersedak namun berjalan di atas kaki besarnya nan pincang. Hanya berjarak 100 meter tersisa. Ini ujung akhir segalanya dari bekal keselamatan keempat. Harapan pamungkas : Bungkusan Terasi Hitam kemerahan pamungkas.",
      "Berteriak nekat dan segenap aura spiritual, Timun Emas menghempas terasi kuat-kuat di tanah gersang rawa terakhir dan berlari tak acuh menoleh buritannya! Ceklok! Suara dentuman merosot merontokkan stabilitas kerak bumi tempat Monster gergasi menginjak daratan saat itu, yang mana lanskap alam berubah jadi kubangan Rawa Lumpur mendidih lahar sembur luap nan menganga lebar!",
      "Ternganga kaget tersentak gravitasi sempit, Monster tak seimbang tertelan ke lautan hisap mendidih panas 200 derajar celcius dari perut bumi magis... \"Rwaaagghhhh!!! Laknathhh!!!\" Suaranya parau terbenam dalam lelehan letusan erupsi lokal membinasakan sejatuh-jatuhnya hingga tak bersisa terkubur kerak padat tanah selamanya.",
      "Begitulah tragedi di batas akhir. Raksasa musnah dalam jurang lumpurnya sendiri. Timun Mas berhasil menipu maut siasat licik dunia bawah dengan empat rintangan pamungkas karunia dari sang kyai suci pertapa bukit tadi siang, kembali bersatu di pelukan tangis Mbok Srini seutuhnya hidup damai tentram."
    ]
  }
};

export default function StoryScreen() {
  const { id } = useLocalSearchParams();
  const book = BOOKS.find((b) => b.id === id) || BOOKS[0];
  const story = STORY_CONTENT[book.id as keyof typeof STORY_CONTENT] || STORY_CONTENT.b1;

  // Reading Mode State (Sepia / Dark Mode)
  const [isSepia, setIsSepia] = useState(false);

  // Dynamic Styles based on Reading Mode
  const dynamicColors = {
    bg: isSepia ? '#F4ECD8' : Colors.bg,
    text: isSepia ? '#2B2720' : 'rgba(255,255,255,0.85)',
    title: isSepia ? '#1F1C16' : Colors.textPrimary,
    headerBg: isSepia ? 'rgba(244,236,216,0.95)' : 'rgba(11, 17, 32, 0.95)',
    btnBg: isSepia ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
    btnText: isSepia ? '#2B2720' : Colors.textPrimary,
  };

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: dynamicColors.bg }]} 
      edges={['top', 'bottom']}
    >
      {/* Stick Header */}
      <View style={[styles.header, { backgroundColor: dynamicColors.headerBg, borderBottomColor: isSepia ? 'rgba(0,0,0,0.1)' : Colors.border }]}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: dynamicColors.btnBg }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionBtnText, { color: dynamicColors.btnText }]}>←</Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: dynamicColors.title }]} numberOfLines={1}>
          {book.title}
        </Text>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: dynamicColors.btnBg }]}
          onPress={() => setIsSepia(!isSepia)}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionBtnText, { color: dynamicColors.btnText }]}>
            {isSepia ? '🌙' : '📖'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {Platform.OS === 'web' ? (
          <View style={[styles.heroCover, { backgroundColor: book.coverColor }]}>
            <Text style={styles.heroEmoji}>{book.emoji}</Text>
          </View>
        ) : (
          <Animated.View entering={FadeInUp.duration(600).delay(100)}>
            <View style={[styles.heroCover, { backgroundColor: book.coverColor }]}>
              <Text style={styles.heroEmoji}>{book.emoji}</Text>
            </View>
          </Animated.View>
        )}

        {Platform.OS === 'web' ? (
          <View style={styles.article}>
            <Text style={[styles.title, { color: dynamicColors.title }]}>{book.title}</Text>
            <Text style={styles.author}>Karya: {book.author}</Text>

            <View style={styles.storyContainer}>
              {story.paragraphs.map((p, idx) => (
                <Text key={idx} style={[styles.paragraph, { color: dynamicColors.text }]}>
                  {p}
                </Text>
              ))}
            </View>
          </View>
        ) : (
          <Animated.View style={styles.article} entering={FadeInUp.duration(600).delay(200)}>
            <Text style={[styles.title, { color: dynamicColors.title }]}>{book.title}</Text>
            <Text style={styles.author}>Karya: {book.author}</Text>

            <View style={styles.storyContainer}>
              {story.paragraphs.map((p, idx) => (
                <Text key={idx} style={[styles.paragraph, { color: dynamicColors.text }]}>
                  {p}
                </Text>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Finishing / Rating Bottom Bar */}
      {Platform.OS === 'web' ? (
        <View style={[styles.bottomBar, { backgroundColor: dynamicColors.headerBg, borderTopColor: isSepia ? 'rgba(0,0,0,0.1)' : Colors.border }]}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>✓ Tandai Selesai Dibaca</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={[styles.bottomBar, { backgroundColor: dynamicColors.headerBg, borderTopColor: isSepia ? 'rgba(0,0,0,0.1)' : Colors.border }]} entering={FadeIn.duration(800).delay(600)}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>✓ Tandai Selesai Dibaca</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    zIndex: 10,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 120, // space for bottom bar
  },
  heroCover: {
    width: width,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  heroEmoji: {
    fontSize: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        // Text shadow on web is different, usually uses textShadow
        textShadow: '0px 10px 20px rgba(0,0,0,0.3)',
      }
    }),
  },
  article: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 8,
    lineHeight: 36,
  },
  author: {
    color: Colors.primaryLight,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 32,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  storyContainer: {
    gap: 20,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 32,
    fontFamily: 'Georgia', // Serif font for classic reading experience
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 0.5,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: `0px 4px 8px ${Colors.primary}4D`,
      }
    }),
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
