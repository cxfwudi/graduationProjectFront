//unicode转字符串方法
export const unicodeToStr = (unicode: string) => {
  return unicode.replace(/\\u([\dA-Fa-f]{4})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))
}
//url转file
export const urlToFile = async (url:string):Promise<File>=>{
  const response = await fetch(url,{
    method:'GET'
  });
  const blob = await response.blob();
  const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
  return file;
}