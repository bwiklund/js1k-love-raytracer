w = 130; //width doubles as height, to save 6 bytes overall
c.width = c.height = w*5;

//b.style.background = "#000"; //i like a black background, but this is way too expensive

//some shortcuts
M = Math
R = M.random
function A(){ return R()-0.5 } //random range from -0.5 to 0.5
P = parseInt

//create the image we'll be writing to. 
//writing directly to this sort of image, 
//and then using built in methods to write it to the canvas, 
//is a ton faster than trying write pixels directly to the canvas
T = a.createImageData(w*5,w*5);
D = T.data; //the actual image data to write to directly

//a function to detect if a photon is inside a sphere, plus the X and Y offset of the sphere. 
//(z is always 0 for the spheres in this scene, so i don't need it)
function z(v,x,y){
	var X = v[0]+x;
	var Y = v[1]+y;
	return X*X+Y*Y+v[2]*v[2] < 1;
}

//some variables that get reused.
m=	//pixelcount
i=	//general use
I=	//general use
j=	//general use
L=	//general use
x=	//general use, usually X
y=	//general use, usually Y
r=  //red
g=  //blue
b=  //green
p=  //the photon
v=  //photon direction
d=  //diffuse color
q=0	//screen pixel count

f = [] // f for framebuffer
for( ; q < w*w*3; ) f[q++] = 0


// m is the framecount
B = function(){
	//for( var i = 0; i < 10000; i++ ){
	//for( q=0;q<w*h; ){
	for( L=0;L++<w*10; ){
		x = q%w/w;
		y = (q-q%w)/w/w;
		
		//camera position
		p = [0,0,-3.5];
		
		//create the initial direction vector, based on screen position.
		//also, randomize it within that pixel for antialising
		v = [ (0.5-(x+R()/w))*0.03,(0.5-(y+R()/w))*0.03,0.03 ]; //vector
		
		r=g=b=0; //r,g, and b are the levels of illumination from each color
		d = 1; //to tell if the surface was hit
		
		//do 400 steps before giving up
		for( I = 0; I++ < 400; ){
			
			//add vector to photon position
			for(i=0;i<3;) p[i]+=v[i++]*(1-R()/2);
			
			//foggy blur
			if( R()<0.003 )for(i=0;i<3;)v[i++] += A()*0.01;
			
			//heart shape
			x = 0.7*(p[0]);
			y = 0.7*(p[2]-1);
			i = 0.7*(p[1]+0.3); //z
			j = x*x+9/4*y*y+i*i-1;
			j*=j*j;
			j -= x*x*i*i*i+9/80*y*y*i*i*i;
			if( j < 0 ){
				v=[A()/10,A()/10,A()/10];
				d=0.5;
			}
			
			//light sources
			if( z(p,2.5,1) ){
				g = 2; b=3; r=3; break;
			}
			if( z(p,-2.5,1) ){
				r = 3; break;
			}
			if( z(p,0,-2.5) || z(p,0,3) ){
				g=b=2;r=3; break;
			}
			
		}
	
		//beams that end facing up should get lit from a skybox
		j = M.max(0,v[1]*27);
		
		//add the light values to the frame buffer
		f[q*3  ] += r+j*1.5;
		f[q*3+1] += d*g+j;
		f[q*3+2] += d*b+j;
		
		q = (++m)%(w*w);
	}
	
	I = M.ceil(m/w/w)/255;
	
	//put it all into a framebuffer, scaled up. 
	//to render it at a high resolution ran too slow,
	//so I wanted to scale it up to make it cheaper.
	//but the default image scaling in most browsers uses
	//smoothing, and I think the aliased, pixelly look is prettier.
	for( x = 0; x < w*5; x++)
	for( y = 0; y < w*5; ){
		i = (P(x/5)+P(y/5)*w);
		j = (x+ + y++ *w*5)*4;
		if( i > q && q != 0 ) break
		for( L = 0; L < 3; ) D[j+L] = f[i*3+L++]/I;
		D[j+3] = 255;
	}
	a.putImageData( T,0,0 );    
	
	//and start the loop over
	setTimeout("B()",5);
}

B();