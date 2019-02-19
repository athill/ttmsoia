
export const embedYoutube = content => {
    const urlPattern =  /\s+https?:\/\/(youtu.be\/|www.youtube.com\/watch\?v=)(\S+)\s*/gim;
    return content.replace(urlPattern, '<div><iframe width="560" height="315" src="https://www.youtube.com/embed/$2" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
};