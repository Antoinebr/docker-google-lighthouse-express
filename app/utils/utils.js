exports.now = () => new Date().toJSON().slice(0,19).replace(/-/g,'/').replace('T',' ');