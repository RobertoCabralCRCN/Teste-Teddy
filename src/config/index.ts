export const config = {
  fileList: [
    'products_01.json.gz',
    'products_02.json.gz',
    'products_03.json.gz',
    'products_04.json.gz',
    'products_05.json.gz',
    'products_06.json.gz',
    'products_07.json.gz',
    'products_08.json.gz',
    'products_09.json.gz',
  ],
  urls: {
    challengeCode:
      process.env.URL_CHALLENGE_CODE ||
      'https://challenges.coode.sh/food/data/json',
  },
  productCountPerFile:
    (process.env.PRODUCT_COUNT_PER_FILE as unknown as number) || 100,
};
