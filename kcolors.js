KCOLORS = {};

KCOLORS.RtoB = function (x, max)    {
    color = {};
    
    if(x/max <= 0.5)   {
        color.r = 1;
        color.g = (x/max)*2;
        color.b = color.g;
    } else {
        color.r = 1-(((x/max)-0.5)*2);
        color.g = color.r;
        color.b = 1;
    }
    return color;
}
KUTIL = {};

KUTIL.rnd_snd = function() {
	return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

KUTIL.rnd = function(mean, stdev) {
	return Math.round(KUTIL.rnd_snd()*stdev+mean);
}