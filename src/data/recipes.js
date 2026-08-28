import { ingredientTranslations, instructionTranslations, recipeTranslations } from './translations'

const bilingual = (ms, en = ingredientTranslations[ms] || ms) => ({ ms, en })

export const stapleIngredients = [
  { id: 'oil', name: bilingual('Minyak', 'Oil'), group: 'Dapur Staples' },
  { id: 'onion', name: bilingual('Bawang', 'Onion'), group: 'Dapur Staples' },
  { id: 'chilli-paste', name: bilingual('Cili kisar', 'Blended chili'), group: 'Dapur Staples' },
  { id: 'soy-sauce', name: bilingual('Kicap', 'Soy sauce'), group: 'Dapur Staples' },
  { id: 'salt', name: bilingual('Garam', 'Salt'), group: 'Dapur Staples' },
]

export const ingredientOptions = [
  { id: 'chicken', name: bilingual('Ayam', 'Chicken'), group: 'Protein' },
  { id: 'beef', name: bilingual('Daging Lembu', 'Beef'), group: 'Protein' },
  { id: 'mutton', name: bilingual('Daging Kambing', 'Mutton'), group: 'Protein' },
  { id: 'egg', name: bilingual('Telur', 'Egg'), group: 'Protein' },
  { id: 'fish', name: bilingual('Ikan merah', 'Red snapper'), group: 'Protein' },
  { id: 'potato', name: bilingual('Kentang'), group: 'Vegetables' },
  { id: 'bean-sprout', name: bilingual('Taugeh'), group: 'Vegetables' },
  { id: 'tomato', name: bilingual('Tomato'), group: 'Vegetables' },
  { id: 'long-bean', name: bilingual('Kacang panjang'), group: 'Vegetables' },
  { id: 'shrimp', name: bilingual('Udang'), group: 'Seafood' },
  { id: 'anchovy', name: bilingual('Ikan bilis'), group: 'Seafood' },
  { id: 'turmeric', name: bilingual('Kunyit'), group: 'Spices' },
  { id: 'lemongrass', name: bilingual('Serai'), group: 'Spices' },
  { id: 'bird-eye-chilli', name: bilingual('Cili padi'), group: 'Spices' },
  { id: 'asam', name: bilingual('Asam jawa'), group: 'Spices' },
  { id: 'coconut-milk', name: bilingual('Santan'), group: 'Spices' },
  { id: 'kerisik', name: bilingual('Kerisik'), group: 'Aromatics' },
  { id: 'curry-spice', name: bilingual('Rempah Kurma'), group: 'Aromatics' },
  { id: 'soup-spice', name: bilingual('Rempah Sup / 4 Beradik'), group: 'Aromatics' },
  { id: 'asam-gelugor', name: bilingual('Asam Gelugor'), group: 'Aromatics' },
  { id: 'galangal', name: bilingual('Lengkuas'), group: 'Aromatics' },
  { id: 'turmeric-leaf', name: bilingual('Daun Kunyit'), group: 'Aromatics' },
  { id: 'fermented-bean-paste', name: bilingual('Taucu'), group: 'Aromatics' },
  { id: 'black-pepper', name: bilingual('Lada Hitam / Serbuk Lada Hitam'), group: 'Aromatics' },
  { id: 'dark-soy-sauce', name: bilingual('Kicap Pekat'), group: 'Sauces' },
  { id: 'black-pepper-sauce', name: bilingual('Sos Lada Hitam'), group: 'Sauces' },
  { id: 'tomato-sauce', name: bilingual('Sos Tomato', 'Tomato sauce'), group: 'Sauces' },
  { id: 'pandan', name: bilingual('Daun Pandan', 'Pandan leaves'), group: 'Aromatics' },
  { id: 'garlic', name: bilingual('Bawang Putih', 'Garlic'), group: 'Aromatics' },
  { id: 'ginger', name: bilingual('Halia', 'Ginger'), group: 'Aromatics' },
  { id: 'red-onion', name: bilingual('Bawang Merah', 'Red onion'), group: 'Aromatics' },
  { id: 'palm-sugar', name: bilingual('Gula Melaka / Gula', 'Palm sugar / Sugar'), group: 'Sauces' },
  { id: 'coriander', name: bilingual('Ketumbar', 'Coriander'), group: 'Aromatics' },
  { id: 'tempe', name: bilingual('Tempe'), group: 'Protein' },
  { id: 'tofu', name: bilingual('Tauhu', 'Tofu'), group: 'Protein' },
  { id: 'soup-leaves', name: bilingual('Daun Sup', 'Celery leaves'), group: 'Aromatics' },
  { id: 'fried-shallots', name: bilingual('Bawang Goreng', 'Fried shallots'), group: 'Aromatics' },
  { id: 'siakap', name: bilingual('Ikan Siakap', 'Sea bass'), group: 'Protein' },
  { id: 'stingray', name: bilingual('Ikan Pari', 'Stingray'), group: 'Protein' },
  { id: 'tilapia', name: bilingual('Ikan Tilapia', 'Tilapia'), group: 'Protein' },
  { id: 'cencaru', name: bilingual('Ikan Cencaru', 'Scad'), group: 'Protein' },
  { id: 'mackerel', name: bilingual('Ikan Kembung', 'Mackerel'), group: 'Protein' },
  { id: 'squid', name: bilingual('Sotong', 'Squid'), group: 'Seafood' },
  { id: 'petai', name: bilingual('Petai'), group: 'Protein' },
  { id: 'fish-sauce', name: bilingual('Sos Ikan', 'Fish sauce'), group: 'Sauces' },
  { id: 'lime', name: bilingual('Limau Nipis', 'Lime'), group: 'Spices' },
  { id: 'white-pepper', name: bilingual('Serbuk Lada Sulah', 'Ground white pepper'), group: 'Spices' },
  { id: 'butter', name: bilingual('Mentega / Butter', 'Butter'), group: 'Sauces' },
  { id: 'green-bird-eye-chilli', name: bilingual('Cili Padi Hijau', 'Green bird eye chili'), group: 'Spices' },
  { id: 'coriander-leaves', name: bilingual('Daun Ketumbar', 'Coriander leaves'), group: 'Aromatics' },
  { id: 'okra', name: bilingual('Bendi', 'Okra'), group: 'Vegetables' },
  { id: 'banana-leaf', name: bilingual('Daun Pisang', 'Banana leaf'), group: 'Aromatics' },
  { id: 'rice-flour', name: bilingual('Tepung Beras', 'Rice flour'), group: 'Spices' },
  { id: 'cornstarch', name: bilingual('Tepung Jagung', 'Cornstarch'), group: 'Spices' },
  { id: 'curry-leaves', name: bilingual('Daun Kari', 'Curry leaves'), group: 'Aromatics' },
  { id: 'kesum-leaves', name: bilingual('Daun Kesum', 'Vietnamese coriander'), group: 'Aromatics' },
  { id: 'torch-ginger', name: bilingual('Bunga Kantan', 'Torch ginger'), group: 'Aromatics' },
  { id: 'green-chilli', name: bilingual('Cili Hijau', 'Green chili'), group: 'Spices' },
  { id: 'yellow-noodles', name: bilingual('Mee Kuning', 'Yellow noodles'), group: 'Carbs' },
  { id: 'rice-vermicelli', name: bilingual('Bihun', 'Rice vermicelli'), group: 'Carbs' },
  { id: 'flat-rice-noodles', name: bilingual('Kuey Teow', 'Flat rice noodles'), group: 'Carbs' },
  { id: 'instant-noodles', name: bilingual('Mee Segera / Maggi', 'Instant noodles'), group: 'Carbs' },
  { id: 'cold-rice', name: bilingual('Nasi Sejuk', 'Cold rice'), group: 'Carbs' },
  { id: 'mustard-greens', name: bilingual('Sawi', 'Mustard greens'), group: 'Vegetables' },
  { id: 'chives', name: bilingual('Daun Kucai', 'Chinese chives'), group: 'Vegetables' },
  { id: 'fishcake', name: bilingual('Fishcake / Kek Ikan', 'Fishcake'), group: 'Seafood' },
  { id: 'carrot', name: bilingual('Lobak Merah', 'Carrot'), group: 'Vegetables' },
  { id: 'tomyam-paste', name: bilingual('Pes Tomyam', 'Tom yum paste'), group: 'Sauces' },
  { id: 'chili-sauce', name: bilingual('Sos Cili', 'Chili sauce'), group: 'Sauces' },
  { id: 'oyster-sauce', name: bilingual('Sos Tiram', 'Oyster sauce'), group: 'Sauces' },
  { id: 'sesame-oil', name: bilingual('Minyak Bijan', 'Sesame oil'), group: 'Sauces' },
  { id: 'cucumber', name: bilingual('Timun', 'Cucumber'), group: 'Vegetables' },
  { id: 'kangkung', name: bilingual('Kangkung', 'Water spinach'), group: 'Vegetables' },
]

const i = (name, amount, id, staple = false, optional = false) => ({ name: bilingual(name), amount, id, staple, optional })

const recipeData = [
  {
    id: 'ayam-goreng-kunyit', name: 'Ayam Goreng Kunyit', style: 'Masakan Kampung', difficulty: 'Simple', time: 30, servings: 4, defaultServings: 4, equipment: ['Kuali', 'Dapur gas'], airFryer: true, accent: 'sunset', pairings: ['sambal-tumis-udang', 'telur-dadar-pedas'],
    ingredients: [i('Isi ayam', '500g', 'chicken'), i('Kunyit hidup', '2 cm', 'turmeric'), i('Kentang', '2 biji', 'potato'), i('Bawang', '1/2 biji', 'onion', true), i('Minyak', '3 sudu besar', 'oil', true), i('Garam', 'secukup rasa', 'salt', true), i('Daun sup', 'sedikit', 'soup-leaves', false, true)],
    steps: ['Gaul ayam bersama kunyit dan garam. Perap selama 10 minit.', 'Panaskan minyak dalam kuali. Goreng kentang hingga garing, kemudian angkat.', 'Goreng ayam sehingga keemasan dan masukkan semula kentang. Gaul rata.', 'Hidangkan panas bersama nasi putih dan hirisan timun.'], tip: 'Tiada kunyit hidup? Gantikan dengan 1 sudu teh serbuk kunyit.', sides: ['Telur dadar bawang', 'Ulam timun'],
  },
  {
    id: 'masak-lemak-cili-api', name: 'Masak Lemak Cili Api', style: 'Masakan Kampung', difficulty: 'Complicated', time: 45, servings: 4, defaultServings: 4, equipment: ['Periuk', 'Lesung batu'], accent: 'lime', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Ayam', '600g', 'chicken'), i('Santan', '500ml', 'coconut-milk'), i('Cili padi', '15 biji', 'bird-eye-chilli'), i('Serai', '2 batang', 'lemongrass'), i('Kunyit hidup', '3 cm', 'turmeric'), i('Bawang', '4 ulas', 'onion', true), i('Garam', 'secukup rasa', 'salt', true), i('Daun limau purut', '2 helai', 'kaffir-lime-leaves', false, true)],
    steps: ['Tumbuk cili padi, kunyit dan bawang hingga lumat.', 'Masukkan bahan tumbuk, serai dan sedikit air ke dalam periuk. Renehkan.', 'Masukkan ayam dan masak hingga empuk.', 'Tuang santan. Kacau perlahan dan masak hingga mendidih kecil.'], tip: 'Santan boleh diganti dengan susu sejat untuk kuah yang lebih ringan.', sides: ['Kacang panjang celur', 'Ikan masin goreng'],
  },
  {
    id: 'asam-pedas-ikan', name: 'Asam Pedas Ikan Merah', style: 'Masakan Kampung', difficulty: 'Complicated', time: 50, servings: 4, defaultServings: 4, equipment: ['Periuk', 'Pengisar'], accent: 'coral', pairings: ['telur-dadar-pedas', 'ayam-goreng-kunyit'],
    ingredients: [i('Ikan merah', '4 keping', 'fish'), i('Asam jawa', '2 sudu besar', 'asam'), i('Tomato', '2 biji', 'tomato'), i('Serai', '1 batang', 'lemongrass'), i('Cili kisar', '4 sudu besar', 'chilli-paste', true), i('Bawang', '5 ulas', 'onion', true), i('Minyak', '4 sudu besar', 'oil', true), i('Garam', 'secukup rasa', 'salt', true), i('Daun kesum', '1 tangkai', 'kesum-leaves', false, true), i('Bunga kantan', '1/2 kuntum', 'torch-ginger', false, true)],
    steps: ['Bancuh asam jawa dengan air dan tapis.', 'Tumis bawang dan cili kisar sehingga pecah minyak.', 'Masukkan air asam, serai dan tomato. Renehkan 15 minit.', 'Masukkan ikan dan masak sehingga isi ikan masak. Perasakan.'], tip: 'Daun kesum dan bunga kantan akan beri aroma asam pedas yang lebih wangi.', sides: ['Bendi rebus', 'Telur masin'],
  },
  {
    id: 'sambal-tumis-udang', name: 'Sambal Tumis Udang', style: 'Masakan Kampung', difficulty: 'Simple', time: 25, servings: 2, defaultServings: 2, equipment: ['Kuali'], accent: 'chilli', pairings: ['ayam-goreng-kunyit', 'telur-dadar-pedas'],
    ingredients: [i('Udang', '400g', 'shrimp'), i('Cili kisar', '5 sudu besar', 'chilli-paste', true), i('Bawang', '6 ulas', 'onion', true), i('Gula', '1 sudu teh', 'salt'), i('Minyak', '4 sudu besar', 'oil', true), i('Garam', 'secukup rasa', 'salt', true), i('Cili hiasan', '1 biji', 'garnish-chilli', false, true)],
    steps: ['Bersihkan udang dan gaul sedikit garam.', 'Tumis bawang dan cili kisar hingga wangi serta pecah minyak.', 'Masukkan gula dan garam, kemudian masukkan udang.', 'Masak 5 minit sahaja supaya udang kekal juicy.'], tip: 'Udang boleh diganti dengan sotong atau isi ikan.', sides: ['Kangkung belacan', 'Acar timun'],
  },
  {
    id: 'nasi-goreng-kampung', name: 'Nasi Goreng Kampung', style: 'Bujang/Express', difficulty: 'Simple', time: 15, servings: 2, defaultServings: 2, equipment: ['Kuali'], accent: 'gold', pairings: ['sambal-tumis-udang', 'telur-dadar-pedas'],
    ingredients: [i('Nasi sejuk', '3 cawan', 'cold-rice'), i('Ikan bilis', '1/2 cawan', 'anchovy'), i('Cili padi', '6 biji', 'bird-eye-chilli'), i('Sawi', '1 cawan', 'mustard-greens'), i('Bawang merah', '4 ulas', 'red-onion'), i('Bawang putih', '3 ulas', 'garlic'), i('Telur', '2 biji', 'egg'), i('Garam', 'secukup rasa', 'salt', true)],
    steps: ['Goreng ikan bilis hingga garing dan ketepikan.', 'Tumis bawang merah, bawang putih dan cili padi hingga wangi.', 'Masukkan telur, nasi sejuk dan sawi. Gaul atas api besar.', 'Perasakan dengan garam dan tabur ikan bilis.'], tip: 'Nasi sejuk dari peti ais menghasilkan nasi goreng yang tidak lembik.', sides: ['Telur mata', 'Timun'],
  },
  {
    id: 'telur-dadar-pedas', name: 'Telur Dadar Bawang', style: 'Bujang/Express', difficulty: 'Simple', time: 10, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'yellow', pairings: ['sambal-tumis-udang', 'ayam-goreng-kunyit'],
    ingredients: [i('Telur', '4 biji', 'egg'), i('Bawang', '1 biji', 'onion', true), i('Cili padi', '5 biji', 'bird-eye-chilli'), i('Garam', 'secubit', 'salt', true), i('Minyak', '3 sudu besar', 'oil', true)],
    steps: ['Pukul telur bersama bawang, cili padi dan garam.', 'Panaskan minyak sehingga betul-betul panas.', 'Tuang telur dan goreng hingga tepi garing. Terbalikkan.', 'Potong dan nikmati bersama nasi panas.'], tip: 'Tambahkan sedikit tepung jagung untuk telur dadar yang lebih gebu.', sides: ['Sambal kicap', 'Sup kosong'],
  },
  {
    id: 'mee-goreng-mamak', name: 'Mee Goreng Mamak', style: 'Mamak', difficulty: 'Simple', time: 20, servings: 2, defaultServings: 2, equipment: ['Kuali', 'Penyepit'], accent: 'orange', pairings: ['telur-dadar-pedas', 'sambal-tumis-udang'],
    ingredients: [i('Mee kuning', '400g', 'yellow-noodles'), i('Telur', '2 biji', 'egg'), i('Tauhu', '2 keping', 'tofu'), i('Sawi', '1 cawan', 'mustard-greens'), i('Taugeh', '1 cawan', 'bean-sprout'), i('Sos cili', '2 sudu besar', 'chili-sauce'), i('Sos tiram', '1 sudu besar', 'oyster-sauce'), i('Kicap manis', '1 sudu besar', 'soy-sauce', true), i('Cili kisar', '2 sudu besar', 'chilli-paste', true), i('Bawang putih', '3 ulas', 'garlic'), i('Cili hijau', '1 biji', 'green-chilli', false, true)],
    steps: ['Tumis bawang putih dan cili kisar sehingga pecah minyak.', 'Masukkan tauhu, telur dan sawi, kemudian kacau rata.', 'Tambah mee, taugeh, sos cili, sos tiram dan kicap manis.', 'Gaul atas api besar hingga mee bersalut. Hiaskan dengan cili hijau.'], tip: 'Semburkan sedikit air semasa menggoreng untuk mee yang lebih lembut.', sides: ['Ayam goreng', 'Limau kasturi'],
  },
  {
    id: 'roti-john', name: 'Roti John', style: 'Mamak', difficulty: 'Complicated', time: 35, defaultServings: 4, servings: 4, equipment: ['Kuali leper'], accent: 'brown', pairings: ['telur-dadar-pedas', 'ayam-goreng-kunyit'],
    ingredients: [i('Daging kisar', '250g', 'beef'), i('Telur', '3 biji', 'egg'), i('Roti panjang', '1 buku', 'bean-sprout'), i('Bawang', '1 biji', 'onion', true), i('Kicap', '1 sudu besar', 'soy-sauce', true)],
    steps: ['Campur daging, telur, bawang dan kicap dalam mangkuk.', 'Belah roti dan sapukan campuran daging di permukaan.', 'Tekapkan bahagian berinti ke atas kuali panas.', 'Balikkan roti dan potong. Hidangkan dengan sos cili dan mayonis.'], tip: 'Gantikan daging dengan ayam kisar atau tuna untuk versi lebih ringan.', sides: ['Salad kubis', 'Kentang goreng'],
  },
  {
    id: 'ayam-madu-air-fryer', name: 'Air Fryer Ayam Madu', style: 'Western Fusion', difficulty: 'Simple', time: 25, defaultServings: 2, servings: 2, equipment: ['Air fryer'], airFryer: true, accent: 'honey', pairings: ['telur-dadar-pedas', 'sambal-tumis-udang'],
    ingredients: [i('Peha ayam', '4 ketul', 'chicken'), i('Madu', '2 sudu besar', 'soy-sauce'), i('Kicap', '1 sudu besar', 'soy-sauce', true), i('Bawang putih', '3 ulas', 'onion', true), i('Garam', 'secubit', 'salt', true)],
    steps: ['Gaul ayam dengan madu, kicap, bawang putih dan garam.', 'Perap sekurang-kurangnya 20 minit.', 'Susun ayam dalam bakul air fryer tanpa bertindih.', 'Masak pada 180°C selama 20-25 minit, balikkan separuh masa.'], tip: 'Tiada air fryer? Bakar dalam ketuhar pada 200°C selama 30 minit.', sides: ['Coleslaw limau', 'Jagung bakar'],
  },
  {
    id: 'chicken-chop-lada-hitam', name: 'Chicken Chop Sos Lada Hitam', style: 'Western Fusion', difficulty: 'Complicated', time: 40, defaultServings: 2, servings: 2, equipment: ['Kuali leper', 'Periuk kecil'], accent: 'pepper', pairings: ['ayam-goreng-kunyit', 'telur-dadar-pedas'],
    ingredients: [i('Dada ayam', '2 keping', 'chicken'), i('Kentang', '3 biji', 'potato'), i('Tomato', '1 biji', 'tomato'), i('Bawang', '1 biji', 'onion', true), i('Kicap', '2 sudu besar', 'soy-sauce', true), i('Garam', 'secukup rasa', 'salt', true)],
    steps: ['Ketuk ayam hingga sekata dan perasakan dengan garam.', 'Pan-sear ayam hingga masak dan keemasan. Rehatkan.', 'Tumis bawang, tambah kicap, lada hitam dan sedikit air.', 'Hidang ayam dengan sos, kentang putar dan salad.'], tip: 'Santan boleh diganti dengan susu sejat dalam sos untuk rasa berkrim.', sides: ['Kentang putar', 'Salad segar'],
  },
  {
    id: 'ayam-masak-kicap', name: 'Ayam Masak Kicap', style: 'Bujang/Express', difficulty: 'Simple', time: 25, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'brown', pairings: ['kangkung-belacan', 'telur-sambal'],
    ingredients: [i('Ayam', '400g', 'chicken'), i('Kentang', '2 biji', 'potato'), i('Kicap manis', '3 sudu besar', 'soy-sauce', true), i('Bawang', '1 biji', 'onion', true), i('Minyak', '2 sudu besar', 'oil', true), i('Cili hiasan', '1 biji', 'garnish-chilli', false, true)],
    steps: ['Goreng kentang hingga keemasan dan ketepikan.', 'Tumis bawang dan masukkan ayam. Masak hingga ayam bertukar warna.', 'Tambah kicap, sedikit air dan kentang. Reneh hingga kuah pekat.', 'Hiaskan dengan cili dan hidangkan bersama nasi panas.'], tip: 'Gantikan ayam dengan tauhu untuk versi bajet.', sides: ['Kangkung belacan', 'Telur mata'],
  },
  {
    id: 'telur-sambal', name: 'Telur Sambal', style: 'Bujang/Express', difficulty: 'Simple', time: 20, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'chilli', pairings: ['ayam-masak-kicap', 'kangkung-belacan'],
    ingredients: [i('Telur', '4 biji', 'egg'), i('Cili kisar', '3 sudu besar', 'chilli-paste', true), i('Bawang', '1 biji', 'onion', true), i('Minyak', '3 sudu besar', 'oil', true), i('Garam', 'secukup rasa', 'salt', true), i('Daun sup', 'sedikit', 'soup-leaves', false, true)],
    steps: ['Rebus telur, kupas dan goreng seketika hingga permukaan sedikit garing.', 'Tumis bawang dan cili kisar hingga pecah minyak.', 'Perasakan sambal, masukkan telur dan gaul perlahan.', 'Tabur daun sup dan hidangkan.'], tip: 'Telur rebus boleh diganti dengan telur mata untuk lebih cepat.', sides: ['Ayam masak kicap', 'Timun'],
  },
  {
    id: 'nasi-goreng-cina', name: 'Nasi Goreng Cina', style: 'Bujang/Express', difficulty: 'Simple', time: 15, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'gold', pairings: ['ayam-goreng-berempah', 'telur-sambal'],
    ingredients: [i('Nasi sejuk', '3 cawan', 'cold-rice'), i('Telur', '2 biji', 'egg'), i('Lobak merah', '1/2 cawan', 'carrot'), i('Bawang putih', '3 ulas', 'garlic'), i('Minyak bijan', '1 sudu teh', 'sesame-oil'), i('Serbuk lada sulah', '1/2 sudu teh', 'white-pepper'), i('Garam', 'secukup rasa', 'salt', true)],
    steps: ['Panaskan kuali dan kacau telur hingga berderai.', 'Tumis bawang putih dan lobak merah, kemudian masukkan nasi sejuk.', 'Perasakan dengan minyak bijan, serbuk lada sulah dan garam.', 'Gaul atas api besar hingga nasi berderai dan hidangkan.'], tip: 'Nasi sejuk semalaman paling sesuai kerana bijinya berderai.', sides: ['Ayam goreng', 'Sup telur'],
  },
  {
    id: 'mee-goreng-express', name: 'Mee Goreng Express', style: 'Bujang/Express', difficulty: 'Simple', time: 12, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'orange', pairings: ['telur-sambal', 'ayam-masak-kicap'],
    ingredients: [i('Mee kuning', '400g', 'bean-sprout'), i('Telur', '2 biji', 'egg'), i('Taugeh', '1 cawan', 'bean-sprout'), i('Kicap', '2 sudu besar', 'soy-sauce', true), i('Cili kisar', '1 sudu besar', 'chilli-paste', true), i('Minyak', '2 sudu besar', 'oil', true), i('Limau kasturi', '1 biji', 'calamansi', false, true)],
    steps: ['Tumis cili kisar dan pecahkan telur.', 'Masukkan mee dan kicap, kemudian gaul hingga bersalut.', 'Masukkan taugeh pada saat akhir supaya rangup.', 'Perah limau kasturi dan hidangkan.'], tip: 'Bilas mee dengan air panas dahulu supaya tidak melekat.', sides: ['Telur sambal', 'Acar timun'],
  },
  {
    id: 'ayam-sambal-hijau', name: 'Ayam Sambal Hijau', style: 'Masakan Kampung', difficulty: 'Simple', time: 35, defaultServings: 2, servings: 2, equipment: ['Kuali', 'Lesung batu'], accent: 'lime', pairings: ['kangkung-belacan', 'telur-sambal'],
    ingredients: [i('Ayam', '400g', 'chicken'), i('Cili hijau', '10 biji', 'bird-eye-chilli'), i('Tomato hijau', '1 biji', 'tomato'), i('Bawang', '1 biji', 'onion', true), i('Minyak', '3 sudu besar', 'oil', true), i('Garam', 'secukup rasa', 'salt', true), i('Daun limau purut', '2 helai', 'kaffir-lime-leaves', false, true)],
    steps: ['Goreng ayam hingga masak dan ketepikan.', 'Tumbuk cili hijau, tomato dan bawang secara kasar.', 'Tumis bahan tumbuk hingga wangi dan masukkan ayam.', 'Perasakan dan masak hingga sambal melekat pada ayam.'], tip: 'Tambah sedikit perahan limau nipis jika mahu sambal lebih segar.', sides: ['Ulam timun', 'Kangkung belacan'],
  },
  {
    id: 'daging-kicap-pedas', name: 'Daging Kicap Pedas', style: 'Masakan Kampung', difficulty: 'Complicated', time: 45, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'pepper', pairings: ['ayam-sambal-hijau', 'telur-sambal'],
    ingredients: [i('Daging batang pinang', '300g', 'beef'), i('Kicap manis', '3 sudu besar', 'soy-sauce', true), i('Cili padi', '8 biji', 'bird-eye-chilli'), i('Bawang', '1 biji', 'onion', true), i('Minyak', '2 sudu besar', 'oil', true), i('Garam', 'secukup rasa', 'salt', true), i('Daun bawang', 'sedikit', 'spring-onion', false, true)],
    steps: ['Hiris daging nipis dan gaul dengan sedikit garam.', 'Tumis bawang dan cili padi hingga wangi.', 'Masukkan daging dan masak hingga airnya kering.', 'Tambah kicap dan sedikit air, kemudian reneh hingga empuk.'], tip: 'Hiris daging melawan urat untuk hasil yang lebih lembut.', sides: ['Telur dadar', 'Acar jelatah'],
  },
  {
    id: 'kangkung-belacan', name: 'Kangkung Belacan', style: 'Masakan Kampung', difficulty: 'Simple', time: 15, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'lime', pairings: ['ayam-masak-kicap', 'daging-kicap-pedas'],
    ingredients: [i('Kangkung', '1 ikat', 'long-bean'), i('Cili kisar', '1 sudu besar', 'chilli-paste', true), i('Belacan', '1 sudu teh', 'bird-eye-chilli'), i('Bawang', '3 ulas', 'onion', true), i('Minyak', '2 sudu besar', 'oil', true), i('Garam', 'secukup rasa', 'salt', true), i('Cili hiasan', '1 biji', 'garnish-chilli', false, true)],
    steps: ['Tumbuk belacan, cili dan bawang hingga lumat.', 'Tumis bahan tumbuk sehingga naik bau.', 'Masukkan batang kangkung dahulu, diikuti daunnya.', 'Goreng pantas, perasakan dan terus hidangkan.'], tip: 'Jangan masak terlalu lama supaya kangkung kekal hijau dan rangup.', sides: ['Ayam masak kicap', 'Telur masin'],
  },
  {
    id: 'gulai-ayam', name: 'Gulai Ayam', style: 'Masakan Kampung', difficulty: 'Complicated', time: 50, defaultServings: 2, servings: 2, equipment: ['Periuk'], accent: 'gold', pairings: ['kangkung-belacan', 'telur-sambal'],
    ingredients: [i('Ayam', '500g', 'chicken'), i('Santan', '300ml', 'coconut-milk'), i('Serbuk kari', '2 sudu besar', 'turmeric'), i('Kentang', '2 biji', 'potato'), i('Serai', '1 batang', 'lemongrass'), i('Bawang', '1 biji', 'onion', true), i('Garam', 'secukup rasa', 'salt', true), i('Daun limau purut', '2 helai', 'kaffir-lime-leaves', false, true)],
    steps: ['Tumis bawang, serai dan serbuk kari hingga pecah minyak.', 'Masukkan ayam dan gaul hingga bersalut rempah.', 'Tambah air dan kentang, kemudian masak hingga ayam empuk.', 'Tuang santan dan perasakan. Reneh tanpa mendidih kuat.'], tip: 'Santan boleh diganti dengan susu sejat untuk kuah yang lebih ringan.', sides: ['Kangkung belacan', 'Acar timun'],
  },
  {
    id: 'ayam-goreng-berempah', name: 'Ayam Goreng Berempah', style: 'Mamak', difficulty: 'Complicated', time: 40, defaultServings: 2, servings: 2, equipment: ['Kuali', 'Lesung batu'], accent: 'orange', pairings: ['nasi-goreng-cina', 'kangkung-belacan'],
    ingredients: [i('Ayam', '500g', 'chicken'), i('Serbuk kari', '1 sudu besar', 'turmeric'), i('Serai', '2 batang', 'lemongrass'), i('Halia', '2 cm', 'turmeric'), i('Tepung jagung', '2 sudu besar', 'potato'), i('Minyak', 'secukupnya', 'oil', true), i('Daun kari', '1 tangkai', 'curry-leaves', false, true)],
    steps: ['Tumbuk serai dan halia, kemudian gaul bersama ayam dan rempah.', 'Tambah tepung jagung dan perap sekurang-kurangnya 30 minit.', 'Goreng ayam dalam minyak sederhana panas hingga garing.', 'Goreng daun kari seketika dan tabur di atas ayam.'], tip: 'Air fryer boleh digunakan pada 190°C selama 25 minit.', sides: ['Nasi putih', 'Acar timun'],
  },
  {
    id: 'air-fryer-chicken-wings-kicap-madu', name: 'Air Fryer Chicken Wings Kicap Madu', style: 'Western Fusion', difficulty: 'Simple', time: 25, defaultServings: 2, servings: 2, equipment: ['Air fryer'], airFryer: true, accent: 'honey', pairings: ['ayam-goreng-berempah', 'kangkung-belacan'],
    ingredients: [i('Kepak ayam', '8 ketul', 'chicken'), i('Madu', '2 sudu besar', 'soy-sauce'), i('Kicap', '2 sudu besar', 'soy-sauce', true), i('Bawang putih', '3 ulas', 'onion', true), i('Garam', 'secubit', 'salt', true), i('Cili hiasan', 'sedikit', 'garnish-chilli', false, true)],
    steps: ['Gaul kepak dengan madu, kicap, bawang putih dan garam.', 'Perap selama 20 minit supaya rasa meresap.', 'Masak dalam air fryer pada 180°C selama 20-25 minit.', 'Balikkan separuh masa dan hidangkan apabila berkilat keemasan.'], tip: 'Lapik bakul dengan kertas pembakar berlubang untuk cucian lebih mudah.', sides: ['Salad kubis', 'Kentang goreng'],
  },
  {
    id: 'ayam-masak-merah', name: 'Ayam Masak Merah', style: 'Masakan Kampung', difficulty: 'Simple', time: 40, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'chilli', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Ayam', '400g', 'chicken'), i('Cili kisar', '3 sudu besar', 'chilli-paste', true), i('Tomato', '2 biji', 'tomato'), i('Sos tomato', '2 sudu besar', 'tomato-sauce'), i('Bawang', '1 biji', 'onion', true), i('Serai', '1 batang', 'lemongrass'), i('Daun pandan', '1 helai', 'pandan', false, true), i('Daun sup', 'sedikit', 'soup-leaves', false, true)],
    steps: ['Goreng ayam separuh masak dan ketepikan.', 'Kisar bawang dan tomato, kemudian tumis bersama cili kisar hingga pecah minyak.', 'Masukkan sos tomato, serai dan daun pandan.', 'Masukkan ayam dan reneh hingga kuah pekat. Hiaskan dengan daun sup.'], tip: 'Ayam boleh digoreng garing dahulu untuk tekstur yang lebih menarik.', sides: ['Nasi minyak', 'Acar timun'],
  },
  {
    id: 'ayam-rendang-minang', name: 'Ayam Rendang Minang', style: 'Masakan Kampung', difficulty: 'Complicated', time: 70, defaultServings: 2, servings: 2, equipment: ['Kuali', 'Lesung batu'], accent: 'brown', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Ayam', '500g', 'chicken'), i('Santan', '400ml', 'coconut-milk'), i('Kerisik', '2 sudu besar', 'kerisik'), i('Daun kunyit', '1 helai', 'turmeric-leaf', false, true), i('Serai', '2 batang', 'lemongrass'), i('Lengkuas', '3 cm', 'galangal'), i('Cili padi', '10 biji', 'bird-eye-chilli'), i('Bawang', '5 ulas', 'onion', true), i('Kunyit', '2 cm', 'turmeric')],
    steps: ['Kisar cili padi, bawang, kunyit dan lengkuas.', 'Tumis bahan kisar bersama serai hingga wangi.', 'Masukkan ayam dan santan, kemudian masak perlahan hingga ayam empuk.', 'Masukkan kerisik dan daun kunyit. Kacau hingga rendang kering dan berminyak.'], tip: 'Masak perlahan supaya rempah meresap dan rendang tahan lebih lama.', sides: ['Ulam timun', 'Sambal hijau'],
  },
  {
    id: 'ayam-penyet', name: 'Ayam Penyet', style: 'Masakan Kampung', difficulty: 'Complicated', time: 55, defaultServings: 2, servings: 2, equipment: ['Periuk', 'Kuali', 'Lesung batu'], accent: 'sunset', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Ayam', '500g', 'chicken'), i('Kunyit', '2 cm', 'turmeric'), i('Serai', '1 batang', 'lemongrass'), i('Bawang putih', '4 ulas', 'garlic'), i('Cili padi', '8 biji', 'bird-eye-chilli'), i('Tomato', '1 biji', 'tomato'), i('Belacan', '1 sudu teh', 'bird-eye-chilli'), i('Tempe', '2 keping', 'tempe', false, true), i('Tauhu', '2 keping', 'tofu', false, true)],
    steps: ['Rebus ayam dengan kunyit, serai dan bawang putih hingga empuk.', 'Goreng ayam, tempe dan tauhu hingga keemasan.', 'Tumbuk cili padi, tomato dan belacan hingga menjadi sambal.', 'Penyet ayam dan hidangkan bersama sambal, tempe serta tauhu.'], tip: 'Tekan ayam perlahan dengan alu supaya sambal lebih mudah melekat.', sides: ['Nasi putih', 'Timun'],
  },
  {
    id: 'ayam-kurma', name: 'Ayam Kurma', style: 'Masakan Kampung', difficulty: 'Simple', time: 45, defaultServings: 2, servings: 2, equipment: ['Periuk'], accent: 'gold', pairings: ['nasi-goreng-kampung', 'telur-sambal'],
    ingredients: [i('Ayam', '500g', 'chicken'), i('Rempah kurma', '2 sudu besar', 'curry-spice'), i('Santan', '300ml', 'coconut-milk'), i('Kentang', '2 biji', 'potato'), i('Bawang', '1 biji', 'onion', true), i('Halia', '2 cm', 'ginger'), i('Bawang putih', '3 ulas', 'garlic')],
    steps: ['Tumis bawang, halia dan bawang putih hingga wangi.', 'Masukkan rempah kurma dan sedikit air, kemudian kacau hingga pecah minyak.', 'Masukkan ayam dan kentang. Tambah air dan masak hingga empuk.', 'Tuang santan, perasakan dan reneh perlahan hingga kuah berkrim.'], tip: 'Jangan biarkan santan mendidih kuat supaya kuah tidak pecah.', sides: ['Nasi minyak', 'Acar jelatah'],
  },
  {
    id: 'ayam-singgang', name: 'Ayam Singgang', style: 'Masakan Kampung', difficulty: 'Simple', time: 40, defaultServings: 2, servings: 2, equipment: ['Periuk'], accent: 'lime', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Ayam', '500g', 'chicken'), i('Asam gelugor', '2 keping', 'asam-gelugor'), i('Halia', '3 cm', 'ginger'), i('Lengkuas', '3 cm', 'galangal'), i('Bawang merah', '5 ulas', 'red-onion'), i('Bawang putih', '3 ulas', 'garlic'), i('Cili padi', '6 biji', 'bird-eye-chilli')],
    steps: ['Masukkan ayam, halia, lengkuas, bawang dan cili padi ke dalam periuk.', 'Tuang air secukupnya dan masak hingga ayam hampir empuk.', 'Masukkan asam gelugor dan perasakan dengan garam.', 'Reneh hingga ayam empuk dan kuahnya terasa masam pedas.'], tip: 'Tambah hirisan kunyit hidup untuk warna dan aroma yang lebih harum.', sides: ['Ulam-ulaman', 'Sambal belacan'],
  },
  {
    id: 'ayam-pongteh', name: 'Ayam Pongteh', style: 'Masakan Kampung', difficulty: 'Simple', time: 45, defaultServings: 2, servings: 2, equipment: ['Periuk'], accent: 'brown', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Ayam', '500g', 'chicken'), i('Taucu', '2 sudu besar', 'fermented-bean-paste'), i('Kentang', '2 biji', 'potato'), i('Bawang putih', '6 ulas', 'garlic'), i('Bawang merah', '3 biji', 'red-onion'), i('Kicap manis', '2 sudu besar', 'soy-sauce', true), i('Gula Melaka', '1 sudu besar', 'palm-sugar')],
    steps: ['Tumis bawang putih dan bawang merah hingga keemasan.', 'Masukkan taucu, kicap manis dan gula Melaka. Kacau rata.', 'Masukkan ayam, kentang dan air secukupnya.', 'Reneh hingga ayam empuk dan kuah menjadi pekat.'], tip: 'Goreng bawang putih hingga wangi untuk rasa pongteh yang lebih dalam.', sides: ['Nasi putih', 'Sayur kailan'],
  },
  {
    id: 'daging-masak-hitam', name: 'Daging Masak Hitam', style: 'Masakan Kampung', difficulty: 'Complicated', time: 65, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'pepper', pairings: ['nasi-goreng-kampung', 'telur-sambal'],
    ingredients: [i('Daging lembu', '400g', 'beef'), i('Kicap pekat', '2 sudu besar', 'dark-soy-sauce'), i('Kicap manis', '2 sudu besar', 'soy-sauce', true), i('Cili kisar', '2 sudu besar', 'chilli-paste', true), i('Rempah kurma', '1 sudu besar', 'curry-spice'), i('Bawang', '1 biji', 'onion', true), i('Halia', '3 cm', 'ginger')],
    steps: ['Rebus daging hingga empuk dan hiris nipis.', 'Tumis bawang, halia, cili kisar dan rempah hingga pecah minyak.', 'Masukkan kicap pekat, kicap manis dan daging.', 'Masak hingga kuah hitam pekat menyelaputi daging.'], tip: 'Simpan sedikit air rebusan untuk melembutkan kuah jika perlu.', sides: ['Nasi putih', 'Acar timun'],
  },
  {
    id: 'daging-dendeng', name: 'Daging Dendeng', style: 'Masakan Kampung', difficulty: 'Complicated', time: 75, defaultServings: 2, servings: 2, equipment: ['Periuk', 'Kuali'], accent: 'chilli', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Daging lembu', '400g', 'beef'), i('Kicap manis', '3 sudu besar', 'soy-sauce', true), i('Cili kisar', '3 sudu besar', 'chilli-paste', true), i('Bawang merah', '5 ulas', 'red-onion'), i('Serai', '2 batang', 'lemongrass'), i('Asam jawa', '1 sudu besar', 'asam')],
    steps: ['Rebus daging hingga empuk, hiris nipis dan ketuk perlahan.', 'Goreng hirisan daging hingga sedikit garing.', 'Tumis bawang, serai dan cili kisar hingga masak.', 'Masukkan kicap, air asam jawa dan daging. Masak hingga kering.'], tip: 'Hiris daging selepas sejuk supaya bentuknya kekal cantik.', sides: ['Nasi putih', 'Acar bawang'],
  },
  {
    id: 'daging-black-pepper', name: 'Daging Black Pepper', style: 'Western Fusion', difficulty: 'Simple', time: 30, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'pepper', pairings: ['nasi-goreng-kampung', 'telur-sambal'],
    ingredients: [i('Daging lembu', '300g', 'beef'), i('Sos lada hitam', '3 sudu besar', 'black-pepper-sauce'), i('Serbuk lada hitam', '1 sudu teh', 'black-pepper'), i('Bawang putih', '3 ulas', 'garlic'), i('Bawang besar', '1 biji', 'onion'), i('Kicap manis', '1 sudu besar', 'soy-sauce', true)],
    steps: ['Hiris daging nipis dan gaul dengan sedikit serbuk lada hitam.', 'Panaskan kuali dan masak daging dengan cepat hingga bertukar warna.', 'Masukkan bawang putih dan bawang besar, kemudian tumis hingga wangi.', 'Tambah sos lada hitam dan kicap manis. Gaul hingga bersalut.'], tip: 'Gunakan api besar supaya daging kekal lembut dan tidak berair.', sides: ['Kentang goreng', 'Salad segar'],
  },
  {
    id: 'sup-daging-berempah', name: 'Sup Daging Berempah', style: 'Masakan Kampung', difficulty: 'Simple', time: 60, defaultServings: 2, servings: 2, equipment: ['Periuk'], accent: 'gold', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Daging lembu', '400g', 'beef'), i('Rempah sup / 4 beradik', '1 paket', 'soup-spice'), i('Halia', '3 cm', 'ginger'), i('Bawang putih', '3 ulas', 'garlic'), i('Bawang merah', '3 biji', 'red-onion'), i('Daun sup', 'sedikit', 'soup-leaves', false, true), i('Bawang goreng', 'sedikit', 'fried-shallots', false, true)],
    steps: ['Rebus daging hingga empuk dan buang buih di permukaan.', 'Tumis bawang, halia, bawang putih dan rempah sup hingga wangi.', 'Masukkan tumisan ke dalam rebusan daging dan renehkan.', 'Tabur daun sup dan bawang goreng sebelum dihidang.'], tip: 'Gunakan periuk tekanan untuk memendekkan masa merebus daging.', sides: ['Nasi putih', 'Sambal kicap'],
  },
  {
    id: 'daging-singgang-terengganu', name: 'Daging Singgang Terengganu', style: 'Masakan Kampung', difficulty: 'Simple', time: 60, defaultServings: 2, servings: 2, equipment: ['Periuk'], accent: 'lime', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Daging lembu', '400g', 'beef'), i('Asam gelugor', '2 keping', 'asam-gelugor'), i('Ketumbar', '1 sudu besar', 'coriander'), i('Lengkuas', '3 cm', 'galangal'), i('Bawang putih', '4 ulas', 'garlic'), i('Cili padi', '6 biji', 'bird-eye-chilli')],
    steps: ['Masukkan daging dan air ke dalam periuk, kemudian rebus hingga hampir empuk.', 'Masukkan lengkuas, bawang putih, ketumbar dan cili padi.', 'Tambah asam gelugor dan garam.', 'Reneh hingga daging empuk dan kuahnya wangi.'], tip: 'Hidangkan panas dengan nasi putih untuk rasa yang lebih menyegarkan.', sides: ['Nasi putih', 'Ulam-ulaman'],
  },
  {
    id: 'kambing-perap-air-fryer', name: 'Kambing Perap Air Fryer', style: 'Air Fryer', difficulty: 'Simple', time: 30, defaultServings: 2, servings: 2, equipment: ['Air fryer'], airFryer: true, accent: 'honey', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Daging kambing', '400g', 'mutton'), i('Kicap manis', '2 sudu besar', 'soy-sauce', true), i('Sos lada hitam', '2 sudu besar', 'black-pepper-sauce'), i('Bawang putih', '3 ulas', 'garlic'), i('Halia', '2 cm', 'ginger'), i('Gula', '1 sudu teh', 'palm-sugar'), i('Madu', '1 sudu besar', 'soy-sauce', false, true)],
    steps: ['Gaul kambing dengan kicap manis, sos lada hitam, bawang putih, halia dan gula.', 'Perap sekurang-kurangnya 30 minit.', 'Susun kambing dalam bakul air fryer tanpa bertindih.', 'Masak pada 190°C selama 15-20 minit dan sapu madu sebelum dihidang.'], tip: 'Hiris kambing nipis supaya cepat empuk dan mudah masak sekata.', sides: ['Kentang putar', 'Salad segar'],
  },
  {
    id: 'ikan-asam-pedas-melaka', name: 'Ikan Asam Pedas Melaka', style: 'Masakan Kampung', difficulty: 'Complicated', time: 45, defaultServings: 2, servings: 2, equipment: ['Periuk', 'Pengisar'], accent: 'coral', pairings: ['nasi-goreng-kampung', 'telur-sambal'],
    ingredients: [i('Ikan pari', '400g', 'stingray'), i('Cili kisar', '4 sudu besar', 'chilli-paste', true), i('Asam jawa', '2 sudu besar', 'asam'), i('Daun kesum', '1 tangkai', 'kesum-leaves', false, true), i('Bunga kantan', '1 kuntum', 'torch-ginger', false, true), i('Bawang', '5 ulas', 'onion', true), i('Halia', '2 cm', 'ginger'), i('Kunyit', '2 cm', 'turmeric'), i('Bendi', '4 batang', 'okra', false, true), i('Tomato', '1 biji', 'tomato', false, true)],
    steps: ['Bancuh asam jawa dengan air dan tapis.', 'Tumis bawang, halia, kunyit dan cili kisar hingga pecah minyak.', 'Masukkan air asam jawa dan ikan pari, kemudian renehkan.', 'Tambah daun kesum, bunga kantan, bendi dan tomato sebelum dihidang.'], tip: 'Ikan kembung boleh digunakan sebagai ganti ikan pari.', sides: ['Nasi putih', 'Telur masin'],
  },
  {
    id: 'ikan-siakap-stim-limau', name: 'Ikan Siakap Stim Limau', style: 'Masakan Kampung', difficulty: 'Simple', time: 30, defaultServings: 2, servings: 2, equipment: ['Pengukus'], accent: 'lime', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Ikan siakap', '1 ekor', 'siakap'), i('Sos ikan', '2 sudu besar', 'fish-sauce'), i('Limau nipis', '3 biji', 'lime'), i('Bawang putih', '4 ulas', 'garlic'), i('Cili padi', '6 biji', 'bird-eye-chilli'), i('Serai', '1 batang', 'lemongrass'), i('Daun ketumbar', 'sedikit', 'coriander-leaves', false, true)],
    steps: ['Bersihkan ikan dan kelar kedua-dua sisinya.', 'Campur sos ikan, jus limau nipis, bawang putih dan cili padi.', 'Letakkan serai di bawah ikan dan kukus hingga masak.', 'Tuang sos limau ke atas ikan dan tabur daun ketumbar.'], tip: 'Kukus ikan sebaik sahaja air mendidih supaya isinya kekal lembut.', sides: ['Nasi putih', 'Sayur kailan'],
  },
  {
    id: 'udang-sambal-petai', name: 'Udang Sambal Petai', style: 'Masakan Kampung', difficulty: 'Simple', time: 25, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'chilli', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Udang', '400g', 'shrimp'), i('Petai', '1 papan', 'petai'), i('Cili kisar', '4 sudu besar', 'chilli-paste', true), i('Bawang merah', '5 ulas', 'red-onion'), i('Bawang putih', '3 ulas', 'garlic'), i('Asam jawa', '1 sudu besar', 'asam'), i('Gula', '1 sudu teh', 'palm-sugar'), i('Garam', 'secukup rasa', 'salt', true)],
    steps: ['Bersihkan udang dan belah petai.', 'Tumis bawang merah, bawang putih dan cili kisar hingga pecah minyak.', 'Masukkan air asam jawa, gula dan garam.', 'Masukkan udang dan petai, kemudian masak hingga udang bertukar warna.'], tip: 'Jangan masak udang terlalu lama supaya kekal manis dan lembut.', sides: ['Nasi putih', 'Ulam timun'],
  },
  {
    id: 'udang-butter-garlic', name: 'Udang Butter Garlic', style: 'Western Fusion', difficulty: 'Simple', time: 20, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'gold', pairings: ['nasi-goreng-kampung', 'telur-sambal'],
    ingredients: [i('Udang', '400g', 'shrimp'), i('Mentega', '3 sudu besar', 'butter'), i('Bawang putih', '5 ulas', 'garlic'), i('Cili padi', '4 biji', 'bird-eye-chilli'), i('Daun kari', '1 tangkai', 'curry-leaves', false, true), i('Serbuk lada sulah', '1/2 sudu teh', 'white-pepper'), i('Garam', 'secukup rasa', 'salt', true)],
    steps: ['Gaul udang dengan serbuk lada sulah dan sedikit garam.', 'Cairkan mentega dan tumis bawang putih serta cili padi.', 'Masukkan daun kari dan udang, kemudian masak hingga bertukar warna.', 'Gaul sehingga udang bersalut mentega dan hidangkan panas.'], tip: 'Gunakan mentega tanpa garam supaya rasa udang lebih seimbang.', sides: ['Roti bawang putih', 'Salad segar'],
  },
  {
    id: 'sotong-masak-hitam', name: 'Sotong Masak Hitam', style: 'Masakan Kampung', difficulty: 'Simple', time: 30, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'pepper', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Sotong', '500g', 'squid'), i('Bawang merah', '4 ulas', 'red-onion'), i('Bawang putih', '3 ulas', 'garlic'), i('Halia', '2 cm', 'ginger'), i('Serai', '1 batang', 'lemongrass'), i('Kunyit', '2 cm', 'turmeric'), i('Cili padi', '5 biji', 'bird-eye-chilli')],
    steps: ['Bersihkan sotong dan simpan kantung dakwatnya.', 'Tumis bawang, halia, serai, kunyit dan cili padi hingga wangi.', 'Masukkan sotong bersama dakwatnya dan kacau rata.', 'Masak seketika sehingga sotong empuk dan kuah menjadi hitam.'], tip: 'Masak sotong dengan cepat supaya tidak liat.', sides: ['Nasi putih', 'Ulam-ulaman'],
  },
  {
    id: 'ikan-cencaru-sumbat-sambal', name: 'Ikan Cencaru Sumbat Sambal', style: 'Masakan Kampung', difficulty: 'Complicated', time: 40, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'sunset', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Ikan cencaru', '2 ekor', 'cencaru'), i('Cili kisar', '3 sudu besar', 'chilli-paste', true), i('Bawang merah', '5 ulas', 'red-onion'), i('Bawang putih', '3 ulas', 'garlic'), i('Asam jawa', '1 sudu besar', 'asam'), i('Serai', '1 batang', 'lemongrass'), i('Kunyit', '2 cm', 'turmeric')],
    steps: ['Belah belakang ikan cencaru dan bersihkan.', 'Tumis bawang, cili kisar, serai dan kunyit hingga masak.', 'Campur sedikit air asam jawa dan sumbat sambal ke dalam ikan.', 'Goreng ikan hingga garing dan masak sepenuhnya.'], tip: 'Belah ikan dari bahagian belakang supaya sambal tidak mudah terkeluar.', sides: ['Nasi putih', 'Air asam'],
  },
  {
    id: 'sotong-goreng-tepung', name: 'Sotong Goreng Tepung', style: 'Bujang/Express', difficulty: 'Simple', time: 25, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'yellow', pairings: ['nasi-goreng-kampung', 'telur-sambal'],
    ingredients: [i('Sotong', '400g', 'squid'), i('Tepung jagung', '4 sudu besar', 'cornstarch'), i('Tepung beras', '2 sudu besar', 'rice-flour'), i('Serbuk lada sulah', '1 sudu teh', 'white-pepper'), i('Bawang putih', '2 ulas', 'garlic'), i('Telur', '1 biji', 'egg'), i('Garam', 'secukup rasa', 'salt', true)],
    steps: ['Bersihkan sotong dan potong gelang.', 'Gaul sotong dengan bawang putih, serbuk lada sulah dan garam.', 'Celup sotong dalam telur dan salut dengan campuran tepung.', 'Goreng dalam minyak panas hingga garing dan hidangkan segera.'], tip: 'Keringkan sotong sebelum disalut supaya tepung melekat lebih baik.', sides: ['Sos cili', 'Salad kubis'],
  },
  {
    id: 'ikan-pari-bakar-sambal', name: 'Ikan Pari Bakar Sambal', style: 'Masakan Kampung', difficulty: 'Simple', time: 40, defaultServings: 2, servings: 2, equipment: ['Kuali leper'], accent: 'coral', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Ikan pari', '400g', 'stingray'), i('Cili kisar', '4 sudu besar', 'chilli-paste', true), i('Bawang merah', '5 ulas', 'red-onion'), i('Bawang putih', '3 ulas', 'garlic'), i('Serai', '1 batang', 'lemongrass'), i('Belacan', '1 sudu teh', 'bird-eye-chilli'), i('Daun pisang', '2 helai', 'banana-leaf', false, true)],
    steps: ['Tumbuk bawang, serai, belacan dan cili kisar menjadi sambal.', 'Tumis sambal hingga masak dan pecah minyak.', 'Letakkan ikan pari di atas daun pisang dan sapu dengan sambal.', 'Bakar hingga ikan masak dan sambal sedikit garing.'], tip: 'Balut dengan aluminium foil jika tiada daun pisang.', sides: ['Nasi putih', 'Air asam'],
  },
  {
    id: 'udang-masak-lemak-cili-api', name: 'Udang Masak Lemak Cili Api', style: 'Masakan Kampung', difficulty: 'Simple', time: 30, defaultServings: 2, servings: 2, equipment: ['Periuk'], accent: 'lime', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Udang', '400g', 'shrimp'), i('Santan', '300ml', 'coconut-milk'), i('Cili padi', '10 biji', 'bird-eye-chilli'), i('Kunyit', '2 cm', 'turmeric'), i('Serai', '1 batang', 'lemongrass'), i('Asam gelugor', '1 keping', 'asam-gelugor'), i('Daun kunyit', '1 helai', 'turmeric-leaf', false, true)],
    steps: ['Kisar cili padi dan kunyit hingga halus.', 'Masukkan bahan kisar, serai dan santan ke dalam periuk.', 'Reneh perlahan sambil dikacau supaya santan tidak pecah.', 'Masukkan udang, asam gelugor dan daun kunyit. Masak hingga udang masak.'], tip: 'Masukkan udang pada akhir masakan supaya tidak liat.', sides: ['Nasi putih', 'Kacang panjang celur'],
  },
  {
    id: 'ikan-kembung-goreng-cili', name: 'Ikan Kembung Goreng Cili', style: 'Masakan Kampung', difficulty: 'Simple', time: 30, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'chilli', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Ikan kembung', '4 ekor', 'mackerel'), i('Cili kisar', '3 sudu besar', 'chilli-paste', true), i('Bawang merah', '5 ulas', 'red-onion'), i('Bawang putih', '3 ulas', 'garlic'), i('Asam jawa', '1 sudu besar', 'asam'), i('Kunyit', '1 cm', 'turmeric'), i('Garam', 'secukup rasa', 'salt', true)],
    steps: ['Gaul ikan dengan kunyit dan garam, kemudian goreng hingga masak.', 'Tumis bawang merah, bawang putih dan cili kisar hingga pecah minyak.', 'Masukkan air asam jawa dan perasakan.', 'Masukkan ikan goreng dan balikkan perlahan hingga bersalut cili.'], tip: 'Goreng ikan sehingga kulit garing sebelum dimasukkan ke dalam sambal.', sides: ['Nasi putih', 'Ulam timun'],
  },
  {
    id: 'sotong-sambal-hijau', name: 'Sotong Sambal Hijau', style: 'Masakan Kampung', difficulty: 'Simple', time: 25, defaultServings: 2, servings: 2, equipment: ['Kuali', 'Lesung batu'], accent: 'lime', pairings: ['nasi-goreng-kampung', 'telur-sambal'],
    ingredients: [i('Sotong', '400g', 'squid'), i('Cili hijau', '8 biji', 'green-chilli'), i('Cili padi hijau', '6 biji', 'green-bird-eye-chilli'), i('Bawang merah', '4 ulas', 'red-onion'), i('Bawang putih', '3 ulas', 'garlic'), i('Limau kasturi', '2 biji', 'calamansi')],
    steps: ['Kisar kasar cili hijau, cili padi, bawang merah dan bawang putih.', 'Tumis bahan kisar hingga wangi dan masak.', 'Masukkan sotong dan masak sehingga bertukar warna.', 'Perah limau kasturi dan gaul sebelum dihidang.'], tip: 'Jangan tutup kuali ketika memasak sotong supaya kuah tidak terlalu berair.', sides: ['Nasi putih', 'Telur dadar'],
  },
  {
    id: 'sup-ikan-merah', name: 'Sup Ikan Merah', style: 'Masakan Kampung', difficulty: 'Simple', time: 35, defaultServings: 2, servings: 2, equipment: ['Periuk'], accent: 'gold', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Ikan merah', '4 keping', 'fish'), i('Rempah sup / 4 beradik', '1 paket', 'soup-spice'), i('Halia', '3 cm', 'ginger'), i('Bawang putih', '3 ulas', 'garlic'), i('Bawang merah', '3 biji', 'red-onion'), i('Daun sup', 'sedikit', 'soup-leaves', false, true), i('Bawang goreng', 'sedikit', 'fried-shallots', false, true), i('Tomato', '1 biji', 'tomato', false, true)],
    steps: ['Tumis bawang merah, bawang putih, halia dan rempah sup hingga wangi.', 'Tambah air dan renehkan sehingga kuah beraroma.', 'Masukkan ikan merah dan tomato, kemudian masak hingga ikan masak.', 'Tabur daun sup dan bawang goreng sebelum dihidang.'], tip: 'Masukkan ikan selepas kuah mendidih supaya isi tidak hancur.', sides: ['Nasi putih', 'Sambal kicap'],
  },
  {
    id: 'char-kway-teow-basah', name: 'Char Kway Teow Basah', style: 'Bujang/Express', difficulty: 'Simple', time: 25, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'brown', pairings: ['nasi-goreng-kampung', 'telur-sambal'],
    ingredients: [i('Kuey teow', '400g', 'flat-rice-noodles'), i('Udang', '200g', 'shrimp'), i('Fishcake', '100g', 'fishcake'), i('Taugeh', '1 cawan', 'bean-sprout'), i('Daun kucai', '1/2 cawan', 'chives'), i('Telur', '2 biji', 'egg'), i('Sos tiram', '1 sudu besar', 'oyster-sauce'), i('Kicap manis', '1 sudu besar', 'soy-sauce', true), i('Kicap pekat', '1 sudu teh', 'dark-soy-sauce'), i('Bawang putih', '3 ulas', 'garlic'), i('Cili kisar', '1 sudu besar', 'chilli-paste', true)],
    steps: ['Tumis bawang putih dan cili kisar hingga wangi.', 'Masukkan udang, fishcake dan telur, kemudian kacau hingga masak.', 'Tambah kuey teow, sos tiram, kicap manis dan kicap pekat.', 'Masukkan taugeh serta daun kucai dan gaul dengan sedikit air hingga basah.'], tip: 'Gunakan api besar dan gaul sebentar supaya kuey teow tidak hancur.', sides: ['Cili jeruk', 'Teh ais'],
  },
  {
    id: 'bihun-goreng-singapore', name: 'Bihun Goreng Singapore', style: 'Bujang/Express', difficulty: 'Simple', time: 25, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'gold', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Bihun', '200g', 'rice-vermicelli'), i('Udang', '150g', 'shrimp'), i('Telur', '2 biji', 'egg'), i('Serbuk lada sulah', '1/2 sudu teh', 'white-pepper'), i('Bawang putih', '3 ulas', 'garlic'), i('Bawang merah', '3 biji', 'red-onion'), i('Lobak merah', '1/2 cawan', 'carrot'), i('Sawi', '1 cawan', 'mustard-greens')],
    steps: ['Rendam bihun hingga lembut dan toskan.', 'Tumis bawang putih dan bawang merah, kemudian masukkan udang.', 'Masukkan telur, lobak merah, sawi dan bihun.', 'Perasakan dengan serbuk lada sulah dan gaul hingga masak.'], tip: 'Jangan rendam bihun terlalu lama supaya tidak lembik ketika digoreng.', sides: ['Cili potong', 'Timun'],
  },
  {
    id: 'nasi-goreng-usa', name: 'Nasi Goreng USA', style: 'Western Fusion', difficulty: 'Simple', time: 30, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'chilli', pairings: ['ayam-goreng-kunyit', 'telur-sambal'],
    ingredients: [i('Nasi sejuk', '3 cawan', 'cold-rice'), i('Sos tomato', '2 sudu besar', 'tomato-sauce'), i('Sos cili', '1 sudu besar', 'chili-sauce'), i('Daging lembu', '200g', 'beef'), i('Sos lada hitam', '1 sudu besar', 'black-pepper-sauce'), i('Bawang besar', '1 biji', 'onion'), i('Telur', '2 biji', 'egg'), i('Timun', '1/2 biji', 'cucumber', false, true)],
    steps: ['Tumis bawang besar dan masak daging lembu hingga berubah warna.', 'Masukkan sos tomato, sos cili dan sos lada hitam.', 'Tambah nasi sejuk dan telur, kemudian goreng hingga sebati.', 'Hidangkan dengan hirisan timun sebagai pelengkap.'], tip: 'Gunakan nasi sejuk supaya hasil gorengan tidak berketul.', sides: ['Ayam goreng', 'Keropok'],
  },
  {
    id: 'maggi-goreng-tumis', name: 'Maggi Goreng Tumis', style: 'Bujang/Express', difficulty: 'Simple', time: 15, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'orange', pairings: ['nasi-goreng-kampung', 'telur-sambal'],
    ingredients: [i('Mee segera / Maggi', '2 paket', 'instant-noodles'), i('Telur', '2 biji', 'egg'), i('Sawi', '1 cawan', 'mustard-greens'), i('Bawang putih', '3 ulas', 'garlic'), i('Cili padi', '4 biji', 'bird-eye-chilli'), i('Kicap manis', '1 sudu besar', 'soy-sauce', true)],
    steps: ['Rebus mee segera hingga separuh lembut dan toskan.', 'Tumis bawang putih dan cili padi hingga wangi.', 'Masukkan telur dan sawi, kemudian kacau hingga masak.', 'Tambah mee dan kicap manis, lalu gaul hingga sebati.'], tip: 'Jangan gunakan terlalu banyak air ketika merebus supaya mee kekal kenyal.', sides: ['Telur mata', 'Cili jeruk'],
  },
  {
    id: 'bihun-sup-daging', name: 'Bihun Sup Daging', style: 'Bujang/Express', difficulty: 'Simple', time: 45, defaultServings: 2, servings: 2, equipment: ['Periuk'], accent: 'lime', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Bihun', '200g', 'rice-vermicelli'), i('Daging lembu', '250g', 'beef'), i('Rempah sup / 4 beradik', '1 paket', 'soup-spice'), i('Halia', '3 cm', 'ginger'), i('Bawang putih', '3 ulas', 'garlic'), i('Taugeh', '1 cawan', 'bean-sprout'), i('Daun sup', 'sedikit', 'soup-leaves', false, true), i('Bawang goreng', 'sedikit', 'fried-shallots', false, true), i('Sambal kicap', '1 sudu besar', 'soy-sauce', true, true)],
    steps: ['Rebus daging bersama halia dan rempah sup hingga empuk.', 'Tumis bawang putih dan masukkan ke dalam kuah rebusan.', 'Rendam bihun, kemudian susun dalam mangkuk bersama taugeh.', 'Tuang sup panas dan hiaskan dengan daun sup, bawang goreng serta sambal kicap.'], tip: 'Hiris daging selepas empuk supaya potongannya lebih kemas.', sides: ['Limau kasturi', 'Cili potong'],
  },
  {
    id: 'kuey-teow-kung-fu', name: 'Kuey Teow Kung Fu', style: 'Bujang/Express', difficulty: 'Complicated', time: 35, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'pepper', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Kuey teow', '400g', 'flat-rice-noodles'), i('Telur', '2 biji', 'egg'), i('Udang', '150g', 'shrimp'), i('Sawi', '1 cawan', 'mustard-greens'), i('Lobak merah', '1/2 cawan', 'carrot'), i('Tepung jagung', '1 sudu besar', 'cornstarch'), i('Bawang putih', '3 ulas', 'garlic'), i('Sos tiram', '1 sudu besar', 'oyster-sauce'), i('Serbuk lada sulah', '1/2 sudu teh', 'white-pepper')],
    steps: ['Goreng kuey teow bersama telur hingga sedikit garing dan ketepikan.', 'Tumis bawang putih, masukkan udang, sawi dan lobak merah.', 'Tuang air, sos tiram dan serbuk lada sulah, kemudian didihkan.', 'Pekatkan kuah dengan tepung jagung dan curah ke atas kuey teow.'], tip: 'Goreng kuey teow tanpa terlalu kerap mengacau supaya ada tekstur garing.', sides: ['Cili jeruk', 'Teh panas'],
  },
  {
    id: 'nasi-goreng-pattaya', name: 'Nasi Goreng Pattaya', style: 'Bujang/Express', difficulty: 'Complicated', time: 30, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'sunset', pairings: ['nasi-goreng-kampung', 'kangkung-belacan'],
    ingredients: [i('Nasi sejuk', '3 cawan', 'cold-rice'), i('Ayam', '200g', 'chicken'), i('Sos cili', '1 sudu besar', 'chili-sauce'), i('Sos tiram', '1 sudu besar', 'oyster-sauce'), i('Lobak merah', '1/2 cawan', 'carrot'), i('Telur', '3 biji', 'egg'), i('Bawang putih', '3 ulas', 'garlic')],
    steps: ['Tumis bawang putih dan masak ayam hingga empuk.', 'Masukkan lobak merah, nasi sejuk, sos cili dan sos tiram.', 'Goreng hingga nasi sebati, kemudian ketepikan.', 'Buat telur dadar nipis, bungkus nasi di tengah dan terbalikkan ke pinggan.'], tip: 'Gunakan kuali tidak melekat untuk menghasilkan telur dadar yang nipis.', sides: ['Timun', 'Sos cili'],
  },
  {
    id: 'bihun-goreng-tomyam', name: 'Bihun Goreng Tomyam', style: 'Bujang/Express', difficulty: 'Simple', time: 25, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'coral', pairings: ['nasi-goreng-kampung', 'telur-sambal'],
    ingredients: [i('Bihun', '200g', 'rice-vermicelli'), i('Pes tomyam', '2 sudu besar', 'tomyam-paste'), i('Udang', '150g', 'shrimp'), i('Daun limau purut', '2 helai', 'kaffir-lime-leaves'), i('Cili padi', '4 biji', 'bird-eye-chilli'), i('Sawi', '1 cawan', 'mustard-greens'), i('Bawang merah', '3 biji', 'red-onion')],
    steps: ['Rendam bihun hingga lembut dan toskan.', 'Tumis bawang merah, cili padi dan pes tomyam hingga wangi.', 'Masukkan udang, daun limau purut dan sawi.', 'Tambah bihun dan gaul hingga masak serta bersalut rempah tomyam.'], tip: 'Tambah sedikit air jika bihun terlalu kering ketika digoreng.', sides: ['Limau nipis', 'Telur mata'],
  },
  {
    id: 'nasi-goreng-cili-padi', name: 'Nasi Goreng Cili Padi', style: 'Bujang/Express', difficulty: 'Simple', time: 20, defaultServings: 2, servings: 2, equipment: ['Kuali'], accent: 'chilli', pairings: ['nasi-goreng-kampung', 'telur-dadar-pedas'],
    ingredients: [i('Nasi sejuk', '3 cawan', 'cold-rice'), i('Cili padi', '8 biji', 'bird-eye-chilli'), i('Bawang merah', '4 ulas', 'red-onion'), i('Bawang putih', '3 ulas', 'garlic'), i('Telur', '2 biji', 'egg'), i('Ikan bilis', '1/2 cawan', 'anchovy')],
    steps: ['Goreng ikan bilis hingga garing dan ketepikan.', 'Tumbuk cili padi, bawang merah dan bawang putih.', 'Tumis bahan tumbuk, masukkan telur dan nasi sejuk.', 'Gaul hingga nasi sebati dan tabur ikan bilis sebelum dihidang.'], tip: 'Laraskan jumlah cili padi mengikut tahap kepedasan yang disukai.', sides: ['Timun', 'Telur mata'],
  },
]

export const groups = ['Protein', 'Vegetables', 'Seafood', 'Spices', 'Aromatics', 'Sauces', 'Carbs']

const difficultyTranslations = { Simple: 'Easy', Complicated: 'Advanced' }
export const recipes = recipeData.map(recipe => {
  const [englishName, englishStyle] = recipeTranslations[recipe.id] || [recipe.name, recipe.style]
  return {
    ...recipe,
    name: bilingual(recipe.name, englishName),
    style: bilingual(recipe.style, englishStyle),
    difficulty: bilingual(recipe.difficulty, difficultyTranslations[recipe.difficulty] || recipe.difficulty),
    equipment: recipe.equipment.map(item => bilingual(item)),
    steps: recipe.steps.map((step, index) => bilingual(step, instructionTranslations[recipe.id]?.[index] || step)),
    tip: bilingual(recipe.tip),
    sides: recipe.sides.map(side => bilingual(side)),
  }
})
