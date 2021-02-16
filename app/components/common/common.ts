import sha1 from 'sha1';
import moment from 'moment';
import DummyPerformer from '../../../assets/images/dummy_performer.png';
import DummySabha from '../../../assets/images/dummy_sabha.png';
import DummyVenue from '../../../assets/images/dummy_venue.png';

const toTitleCase = (str: string): string => {
  return str.replace(
    /.*/g,
    (txt: string): string =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};
const toCapCase = (str: string): string => {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};
const DummyImage =
  'https://res.cloudinary.com/dvfal5dhy/image/upload/v1572338367/bpfwkwx2lismzizcddyg.png';

const uploadToCloud = async (
  imageFile: string,
  folderFor: 'Event' | 'Performers' | 'Series' | 'Venue' | 'Album',
  cb: ({ secureUrl }: { secureUrl: string }) => void
): Promise<void> => {
  const data = new FormData();
  const API_KEY = process?.env?.REACT_APP_CLOUDINARY_API;
  const API_SECRET = process?.env?.REACT_APP_CLOUDINARY_SECRET;
  const url = 'https://api.cloudinary.com/v1_1/dvfal5dhy/image/upload';
  if (API_KEY && API_SECRET) {
    const apiKey: string = API_KEY;
    const secret: string = API_SECRET;
    const timestamp = moment().unix();
    let signatureStr = `timestamp=${timestamp}${secret}`;
    data.append('file', imageFile);
    data.append('api_key', apiKey);
    data.append('timestamp', timestamp.toString());
    signatureStr = `folder=${folderFor}&timestamp=${timestamp}${secret}`;
    data.append('folder', folderFor);
    const signature = sha1(signatureStr);
    data.append('signature', signature);
  }
  // Upload to cloudinary
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: data,
    });
    const json = await response.json();
    if (json?.secure_url?.length > 0) {
      const secureUrl = json?.secure_url;
      cb({ secureUrl });
    }
  } catch (err) {
    // console.log('There is error ', err);
  }
};

const chooseDummyImage = (collectionFrom: any): string => {
  const isPerformer: boolean = collectionFrom
    ?.toLowerCase()
    .includes('performer');
  const isSabha: boolean = collectionFrom?.toLowerCase().includes('sabha');
  if (isPerformer) {
    return DummyPerformer;
  }
  if (isSabha) {
    return DummySabha;
  }
  return DummyVenue;
};

const isValidHttpUrl = (string: string): boolean => {
  let url: URL;
  try {
    url = new URL(string);
  } catch (e) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export {
  toTitleCase,
  DummyImage,
  uploadToCloud,
  chooseDummyImage,
  toCapCase,
  isValidHttpUrl,
};
