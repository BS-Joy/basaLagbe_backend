import Ads from "../models/adsModel.js";

// add ads
// post request
export const createAds = async (req, res) => {
  try {
    const {
      authorId,
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
      whatsapp,
    } = req.body;

    const data = {
      authorId,
      title,
      description,
      category,
      location: {
        division,
        district,
        area,
      },
      address,
      rent,
      floor,
      bedroom,
      bathroom,
      availableForm,
      contact: {
        phone,
        whatsapp,
      },
    };

    const response = await Ads.create(data);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getAds = async (req, res) => {
  try {
    const result = await Ads.find({});
    console.log(result);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getAdsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    // console.log({ authorId });
    const ads = await Ads.find({ authorId });
    res.status(200).send(ads);
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

// export const deleteAds = async (req, res) => {
//     const response = await Ads.deleteMany({});
//     console.log(response)
//     res.send(response)
// }

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
