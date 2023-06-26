const asyncHandler= require('express-async-handler')
const bcrypt = require('bcrypt')
require("dotenv").config()
const {Prisma, PrismaClient}=require('@prisma/client')
const e = require('express')
const urlDB=process.env.NODE_ENV==='development'?process.env.MONGODB_PMBTOYS_LOCAL:MONGODB_PMBTOYS_ADMIN
let prisma=new PrismaClient({
    datasources:{
        db:{
            url: urlDB
        }
    }
})

const runSeeder=asyncHandler(async(req,res)=>{
    const url=req.url   
    
    let data=[]
    let category_seeder, warna_seeder, fitur_seeder

    prisma.Users.deleteMany()
    prisma.Registers.deleteMany()
    prisma.Category.deleteMany()
    prisma.Warna.deleteMany()
    prisma.Fitur.deleteMany()
    prisma.Product.deleteMany()
    prisma.Stock.deleteMany()

    let password='admin'
    const salt = bcrypt.genSaltSync(10);
    const Hasspassword = bcrypt.hashSync(password,salt)
    const compareHasspassword=bcrypt.compareSync(password,Hasspassword)  

    let admin=await prisma.Users.create({
        data:{
            email:"admin@pmbtoys.co.id",
            password:Hasspassword,
            token:{
                create:{
                    string:Hasspassword
                }
            }
        }
    })

    category_seeder=await prisma.Category.createMany({
        data:[
            { name: "BMX", slug_category:"bmx"},
            { name: "Gokart", slug_category:"gokart"},
            { name: "Mobil Aki", slug_category:"mobil-aki"},
            { name: "Scooter", slug_category:"scooter"},
            { name: "Sepeda Roda Tiga", slug_category:"sepeda-roda-tiga"},
            { name: "Stroller", slug_category:"stroller"},
            { name: "Seri Polisi", slug_category:"seri-polisi"}
        ]
    })

    warna_seeder=await prisma.Warna.createMany({
        data:[
            {nama:"merah", kode:"#ff0000"},
            {nama:"kuning", kode:"#ff0000"},
            {nama:"hijau", kode:"#ff0000"},
            {nama:"biru", kode:"#ff0000"},
            {nama:"pink", kode:"#ff0000"},
            {nama:"putih", kode:"#ffffff"},
            {nama:"hitam", kode:"#000000"},
        ]
    })


    fitur_seeder=await prisma.Fitur.createMany({
        data:[
            {fitur_name:'remote control'},
            {fitur_name:'Sabuk Pengaman'},
            {fitur_name:'Batre'}
        ]
    })

    getCategory=await prisma.Category.findMany({})
    getWarna=await prisma.Warna.findMany({})
    getFitur=await prisma.Fitur.findMany({})

    let jumlah_cat = await getCategory.length
    let jumlah_warna = await warna_seeder.length
    let catId,catName,warnaId,insert,listProduk,insertStock
    for(var x=0; x<getCategory.length; x++)
    {
        catId=getCategory[x].id
        catName=getCategory[x].slug_category
        insertProduks = await insertProduk(catId,catName,getWarna,getFitur,dataNya)    

    }

    listProduk= await prisma.Product.findMany({})
    insertStock = await insertStocks(getWarna,listProduk)    
    insertRegister = await insertRegisters(dataNya)    


    


    res.status(200)
    res.json({
        result:"Index Seeder - Controllers",
        data:{data: getCategory.length,category_seeder,warna_seeder,fitur_seeder, getCategory, getWarna}
    })
    res.end()
})

const insertRegisters=asyncHandler(async(data)=>{
    let listRegister=data.registers
    let insert
    for(var x=0; x<listRegister.length; x++)
    {
        nama_lengkap=listRegister[x].nama_lengkap
        phone=listRegister[x].phone
        email=listRegister[x].email
        mailing=listRegister[x].mailing
        insert=await prisma.Registers.create({
            data:{
                namaLengkap:nama_lengkap,
                email:email,
                nomorTelpon:phone,
                mailing:mailing,
            }
        })
        if(!insert){ return }
    }
})


const insertStocks=asyncHandler(async(listWarna,listProduk)=>{
    let jumlah_warna=listWarna.length
    let jumlah_produk=listProduk.length
    let insert
    for(var x=0; x<jumlah_warna; x++){
        for(var y=0; y<jumlah_produk; y++){
            warnaID=listWarna[x].id
            productID=listProduk[y].id
            insert=await prisma.Stock.create({
                data:{
                    productID:productID,
                    warnaID:warnaID,
                    jumlah:mt_rand(0,100)
                }
            })
        }
    }
})

const insertProduk=asyncHandler(async(catID,catName,warna,fitur,data)=>{

    let fiturs,warnas,rand

    let insert
    let items=data.products.items
    for(let i=0; i<items.length; i++){
        if(catName===items[i].slug_category){
            rand=mt_rand (0, fitur.length)
            fiturs=new Array()
            for(let z=0; z<(rand===0?1:rand); z++){
                fiturs.push(fitur[z].id)
            }        
            insert = await prisma.Product.create({
                data:{
                    name: items[i].name,
                    slug: items[i].slug.toLowerCase(),
                    categoryID: catID,
                    fiturID:fiturs
                }
            })
        }
    }
    // console.log(JSON.stringify(data.products.items))
    return catID
}
)

const dataNya= {
    products:
    {
        categories:[
            {id:1,slug:"mobil-aki",name:"Mobil Aki"},
            {id:2,slug:"stroller",name:"Stroller"},
            {id:3,slug:"scooter",name:"Scooter"},
            {id:4,slug:"gokart",name:"Gokart"},
            {id:5,slug:"bmx",name:"Bmx"},
            {id:6,slug:"sepeda-roda-tiga",name:"Sepeda Roda Tiga"},
            {id:7,slug:"seri-polisi",name:"Seri Polisi"},
        ],
		items:[
			
			{	id:1, cat_id:1, slug_category:"mobil-aki", name:"Mitsubishi Triton (M-8688)", slug:"M–8688", 
				description:"Dilengkapi dengan aki berkapasitas 6V 7ah, mobil ini didukung sistem anti shock pada motor pengeraknya. Selain itu mobil ini juga dilengkapi dengan berbagai fitur lainnya, seperti musik, USB, bluetooth, sabuk pengaman, dan terdapat bagasi dibagian belakang.",
				images:['M-8688-img-1.jpg','M-8688-img-2.jpg','M-8688-img-3.jpg','M-8688-img-4.jpg']
			},
			{	id:2, cat_id:1, slug_category:"mobil-aki", name:"M – 5688", slug:"M–5658",
				description:"IC Musik dan Lampu, remote 2,4G, USB Soket, Dobel dinamo, Baterai 2 x 6V isi ulang, Sabuk pengaman.",
				images:['M-5688-img-1.jpg','M-5688-img-2.jpg','M-5688-img-3.jpg','M-5688-img-4.jpg']
			},
			{	id:3, cat_id:1, slug_category:"mobil-aki", name:"M – 6869", slug:"M–6869",
				description:"Air Fan, Baterai 2 x 6V 7 Ah Jok Kulit, Bodi Cat, Ban Eva Music, Lampu, Sabuk pengaman 2 Dinamo, Anti Kejut, USB Bluetooth, Remote Bluetooth, Pintu dapat dibuka .",
				images:['M-6869-img-1.jpg','M-6869-img-2.jpg','M-6869-img-3.jpg','M-6869-img-4.jpg']
			},
			{	id:4, cat_id:1, slug_category:"mobil-aki", name:"M – 6168", slug:"M–6168", 
				description:"IC Musik dan Lampu, remote 2,4G, USB Soket, Dobel dinamo, Baterai 2 x 6V isi ulang, Sabuk pengaman.",
				images:['M-6168-img-1.jpg','M-6168-img-2.jpg','M-6168-img-3.jpg']
			},


			{	id:5, cat_id:8, slug_category:"seri-polisi", name:"M – 188", slug:"M–188", 
				description:"IIC Musik dan Lampu, Batterai 6 V 4.5 Ah, Sabuk Pengaman.",
				images:['M-188-img-1.jpg','M-188-img-2.jpg','M-188-img-3.jpg','M-188-img-4.jpg']
			},
			{	id:6, cat_id:8,  slug_category:"seri-polisi", name:"M – 338", slug:"M–338", 
				description:"IC Musik dan Lampu, USB Soket, Baterai isi ulang.",
				images:['M-338-img-1.jpg','M-338-img-2.jpg','M-338-img-3.jpg','M-338-img-4.jpg']
			},
			{	id:7, cat_id:8,  slug_category:"seri-polisi", name:"M – 588", slug:"M–588", 
				description:"IC Musik dan Lampu, USB Soket, Baterai isi ulang.",
				images:['M-588-img-1.jpg','M-588-img-2.jpg','M-588-img-3.jpg','M-588-img-4.jpg']
			},
			{	id:8, cat_id:8,  slug_category:"seri-polisi", name:"M – 688", slug:"M–688", 
				description:"IC Musik dan Lampu, USB Soket, Baterai isi ulang.",
				images:['M-688-img-1.jpg','M-688-img-2.jpg','M-688-img-3.jpg','M-688-img-4.jpg']
			},
			

			{	id:8, cat_id:4, slug_category:"gokart", name:"G - 101", slug:"G-101", 
				description:"IC Music dan Lampu.",
				images:['G-101-img-1.jpg','G-101-img-2.jpg','G-101-img-3.jpg','G-101-img-4.jpg']
			},
			{	id:9, cat_id:4, slug_category:"gokart", name:"G - 102", slug:"G-102", 
				description:"IC Music dan Lampu.",
				images:['G-102-img-1.jpg','G-102-img-2.jpg','G-102-img-3.jpg','G-102-img-4.jpg']
			},

			{	id:10, cat_id:3, slug_category:"scooter", name:"S - 01", slug:"S-01", 
				description:"Musik, Lampu.",
				images:['S-01-img-1.jpg','S-01-img-2.jpg','S-01-img-3.jpg','S-01-img-4.jpg']
			},
			{	id:11, cat_id:3, slug_category:"scooter", name:"S-02", slug:"S-02", 
				description:"Musik, Lampu.",
				images:['S-02-img-1.jpg','S-02-img-2.jpg','S-02-img-3.jpg','S-02-img-4.jpg']
			},
			{	id:12, cat_id:3, slug_category:"scooter", name:"S - 03", slug:"S-03", 
				description:"Musik, Lampu.",
				images:['S-03-img-1.jpg','S-03-img-2.jpg','S-03-img-3.jpg']
			},
			{	id:13, cat_id:2, slug_category:"stroller", name:"S - 05", slug:"S-05", 
				description:"Musik, Lampu.",
				images:['S-05-img-1.jpg','S-05-img-2.jpg','S-05-img-3.jpg','S-05-img-4.jpg']
			},

			{	id:14, cat_id:6, slug_category:"sepeda-roda-tiga", name:"T - 10", slug:"T-10", 
				description:"Kemudi belakang  Musik, Lampu, Lingkaran pengaman, kanopi, Sandaran besar  Kursi dapat di putar.",
				images:['T-10-img-1.jpg','T-10-img-2.jpg','T-10-img-3.jpg' ]
			},
			{	id:15, cat_id:6, slug_category:"sepeda-roda-tiga", name:"T - 11", slug:"T-11", 
				description:"Kemudi belakang  Musik, Lampu, Lingkaran pengaman, kanopi, Sandaran besar  Kursi dapat di putar.",
				images:['T-11-img-1.jpg','T-11-img-2.jpg','T-11-img-3.jpg' ]
			},
			{	id:16, cat_id:6, slug_category:"sepeda-roda-tiga", name:"T - 17", slug:"T-17", 
				description:"Kemudi belakang Musik, Lampu, Lingkaran pengaman, kanopi, Sandaran besar Kursi dapat di putar .",
				images:['T-17-img-1.jpg','T-17-img-2.jpg','T-17-img-3.jpg','T-17-img-4.jpg' ]
			},
			{	id:17, cat_id:6, slug_category:"sepeda-roda-tiga", name:"T - 18", slug:"T-18", 
				description:"Kemudi belakang Musik, Lampu, Lingkaran pengaman, kanopi, Sandaran besar Kursi dapat di putar .",
				images:['T-18-img-1.jpg','T-18-img-2.jpg','T-18-img-3.jpg','T-18-img-4.jpg']
			},
			
			{	id:18, cat_id:2, slug_category:"stroller", name:"S - 06", slug:"S-06", 
				description:": Lingkaran Pengaman Lampu.",
				images:['S-06-img-1.jpg','S-06-img-2.jpg','S-06-img-3.jpg','S-06-img-4.jpg']
			},
		]		
		
    },
    articles:[
        {id:1,slug:"artikel-sample",title:"How to create a profile page using Appy",excerpt:"Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore.",images:['articles-1.png'],content:"Ini adalah artikel sample. Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore."},
        {id:2,slug:"artikel-sample-2",title:"20+ elements of a modern website design",excerpt:"Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore.",images:['articles-2.png'],content:"ini adalah artikel sample 2. Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore."},
        {id:3,slug:"artikel-sample-3",title:"20 unique places to find web design inspiration",excerpt:"Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore.",images:['articles-3.png'],content:"ini adalah artikel sample 3. Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore."},
        {id:4,slug:"artikel-sample-4",title:"What to look for in a digital portfolio",excerpt:"Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore.",images:['articles-4.png'],content:"ini adalah artikel sample 4. Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore."},
        {id:5,slug:"artikel-sample-5",title:"Why your customers needs a responsive website",excerpt:"Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore.",images:['articles-5.png'],content:"ini adalah artikel sample 4. Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore."},
        {id:6,slug:"artikel-sample-5",title:"Launch lessons: the creators of Intrusive Inc.",excerpt:"Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore.",images:['articles-6.png'],content:"ini adalah artikel sample 4. Lorem ipsum dolor sit amet, consectetur adipisc elit, sed do eiusmod tempor incididunt ut labore."},
    ],
    socmeds:[
        {name:"twitter",link:"https://twitter.com/pmbtoys"},
        {name:"github",link:"https://github.com"},
        {name:"facebook",link:"https://web.facebook.com/pmbtoysofficial"},
        {name:"instagram",link:"https://www.instagram.com/pmbtoysofficial/"},
        {name:"linkedin",link:"https://www.linkedin.com/in/imam-mubin-74261541/"},
        {name:"youtube",link:"https://youtu.be/ZkDD4YGtsFI"},
    ],
    registers:[
        { nama_lengkap:"Dani", phone:"0818270998", email:"dani@yahoo.com", mailing:false},
        { nama_lengkap:"Hendra Atmaja", phone:"08122270998", email:"Hendra@yahoo.com", mailing:false},
        { nama_lengkap:"Yoyok Hendra", phone:"08223454998", email:"Hendra@gmail.com", mailing:true},
        { nama_lengkap:"Tedi Setiadi", phone:"0818270998", email:"Setiadi@hotmail.com", mailing:false},
        { nama_lengkap:"Nela Basir", phone:"0818572398", email:"Basir@gmail.com", mailing:true},
        { nama_lengkap:"Lala Kurnia", phone:"08184230998", email:"Lala@yahoo.com", mailing:false},
        { nama_lengkap:"Sahira", phone:"08124350998", email:"Sahira@gmail.com", mailing:false},
    ],
	pages:{
		home:null,
		about:{
			story: {
				title: "our story",
				description: "PT. Pangeran Maju Bahagia adalah perusahaan yang bergerak di bidang produksi perakitan sepeda dan mainan anak.",
				icons:[
					{title:"berdiri tahun 2010",url:"icons-kapal.png"},
					{title:"500 Karyawan",url:"icons-hati-dan-tangan.png"},
					{title:"200 unit/tahun",url:"icons-kembang.png"},
					{title:"200K+ Dropshipper",url:"icons-tangan.png"},
				],
				images:[
					'about-our-story/1.png',
					'about-our-story/2.png',
					'about-our-story/3.png',
					'about-our-story/4.png',
					'about-our-story/5.png',
					'about-our-story/6.png',
				]
			},
			visimisi:{
				visi: "Visi kami adalah untuk menjadi produsen kelas dunia mainan anak-anak untuk pasar internasional.",
				misi:[
					"Melakukan Pengembangan serta meningkatkan kualitas dan Produktifitas",
					"Selalu berinofasi untuk memenuhi kebutuhan Konsumen",
					"Memperluas jaringan pemasaran",
				],
				images:[
					'about-visi-misi/1.png',
					'about-visi-misi/2.png',
					'about-visi-misi/3.png',
				]
			},
			lokasi:{
				alamat:"Jl. Perancis, Komplek Pergudangan Pantai lndah Dadap.",
				alamat_baris_2:"Blok HA/3-5, Kec. Tangerang, 15138",
				phone:"(021) 55954690",
				admin:"+62 811-8181-522",
				email:"marketing@pmbtoys.com",
				jamkerja:"8:30AM – 5:00PM",
				images:['gmap.png']
			}
		}
	}
} 

function mt_rand (min, max) { // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/mt_rand/
    // original by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (https://brett-zamir.me)
    //    input by: Kongo
    //   example 1: mt_rand(1, 1)
    //   returns 1: 1
    const argc = arguments.length
    if (argc === 0) {
      min = 0
      max = 2147483647
    } else if (argc === 1) {
      throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given')
    } else {
      min = parseInt(min, 10)
      max = parseInt(max, 10)
    }
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
module.exports={runSeeder} 
