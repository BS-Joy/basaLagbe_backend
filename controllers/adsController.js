import Ads from "../models/adsModel.js";

// add ads
// post request
export const createAds = async (req, res) => {
    const {
        title,
        description,
        category,
        division,
        district,
        area,
        address,
        rent,
        floor,
        bedroom,
        bathroom,
        availableForm,
        phone,
        whatsapp
    } = req.body;

    const data = {
        title,
        category,
        location: {
            division,
            district,
            area
        },
        address,
        rent,
        floor,
        bedroom,
        bathroom,
        availableForm,
        contact: {
            phone,
            whatsapp
        }
    }

    console.log(data);
    const response = await Ads.create(data)
    res.status(200).send(response);
}

export const getAds = async(req, res) => {
    const result = await Ads.find({})
    // console.log(result)
    res.send(result);
}

// const data = {
//     title: '১টি ফ্ল্যাট ভাড়া হবে',
//     category: 'family',
//     location: {
//         divison,
//         district,
//         area: 'jatrabari',
//         address: 'শনির আখড়া, জিয়া স্মরণী রোড, রসুল বাগ'
//     } ,
//     rent: '12000',
//     floor: 4,
//     bedroom: 2,
//     bathroom: 1,
//     contact: {
//         phone: '021512254120',
//         whatsapp: '021512254120'
//     }
// }