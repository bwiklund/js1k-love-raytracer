javascript raytracer in 941 bytes
===

Made for [js1k 2012 - "love"](http://js1k.com/2012-love/)

See it in action here: https://rawgithub.com/bwiklund/js1k-love-raytracer/master/index.html

![render 3](https://raw.github.com/bwiklund/js1k-love-raytracer/master/samples/shot3.png)

It takes several render passes before it looks any good, and it's quite slow.

But, because it's simulating the behavior of photons (reverse photon mapping), lots of cool features fall out of it:

- Global illumination
- Atmospheric effects (rays have a slight chance to deflect while travelling through air)
- Antialiasing (each photon is slightly randomized within the pixel it originated from)

Because it fits in under 1024 bytes of javascript, sacrifices had to be made:

- Photons are steped through space in small increments, then check for collisions. Actual sphere-line intersection and reflection would have taken up way too many bytes!
- No support for glossy materials, for above reason. When a photon finds itself within a sphere / heart shape, it changes it's direction randomly, and continues on it's way. Thus, diffuse surfaces.
- Fairly slow. Code length was the only thing optimized for.
