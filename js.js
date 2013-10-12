//width doubles as height, to save 6 bytes overall
c.width = c.height = w = 120;

//b.style.background = "#000"; //i like a black background, but this is way too expensive

//some shortcuts
M = Math
R = M.random
function A(){ return R()-0.5 } //random range from -0.5 to 0.5

//create the image we'll be writing to. 
//writing directly to this sort of image, 
//and then using built in methods to write it to the canvas, 
//is a ton faster than trying write pixels directly to the canvas
T = a.createImageData(w,w);
D = T.data; //the actual image data to write to directly

//a function to detect if a photon is inside a sphere, plus the X and Y offset of the sphere. 
//(z is always 0 for the spheres in this scene, so i don't need it)
function Z(v,x,y){
  X = v[0]+x;
  Y = v[1]+y;
  return X*X+Y*Y+v[2]*v[2] < 1;
}

f = [] // f for framebuffer
// m is the vertical row count, which we use later, and save a byte by initializing here
for( i=0; i < w*w*3; ) f[i++]=0

K=1; //TODO: sneak in elsewhere

// m is the framecount
B = function(){
  //for( var i = 0; i < 10000; i++ ){
  //for( q=0;q<w*h; ){
  for( I=0;I<w*w; ){
    x = I%w/w;
    y = ~~(I/w)/w;
    
    //camera position
    p = [0,0,-3.5];
    
    //create the initial direction vector, based on screen position.
    //also, randomize it within that pixel for antialising
    v = [ (0.5-(x+R()/w))*0.03,(0.5-(y+R()/w))*0.03,0.03 ]; //vector
    
    d = 1; //to tell if the surface was hit
    
    //do 200 steps before giving up
    for( r=g=b=J=0; J++ < 200; ){
      
      //add vector to photon position
      for(i=0;i<3;) p[i]+=v[i++]//*(1-R()/2);
      
      //foggy blur
      //this is by far the most obscene omtimization here...
      //instead of reinitializing i=0, we know it's 3 from the last loop,
      //so we iterate downwards instead. 
      //also, the loop stops at zero, so i omit ;i>=0 in favor of truthyness.
      //it saved 5 bytes.
      if( R()<0.004 )for(;i;)v[--i] += A()*0.01;
      
      //heart shape
      x = 0.7*(p[0]);
      y = 0.7*(p[2]-1);
      z = 0.7*(p[1]+0.3); //z
      j = x*x+9/4*y*y+z*z-1;
      j*=j*j;
      j -= x*x*z*z*z+9/80*y*y*z*z*z;
      if( j < 0 ){
        v=[A()/10,A()/10,A()/10];
        d=0.5;
      }
      
      //light sources
      if( Z(p,2.5,1) ){
        g = 2; b=r=3;
      }
      if( Z(p,-2.5,1) ){
        r = 3;
      }
      if( Z(p,0,-2.5) || Z(p,0,3) ){
        g=b=2;r=3;
      }
      
    }
  
    //beams that end facing up should get lit from a skybox
    C = M.max(0,v[1]*27);
    
    //add the light values to the frame buffer
    f[S=I*3] += r+C*1.5;
    f[++S] += d*g+C;
    f[++S] += d*b+C;


    // update framebuffer from array of floats
    for( P = 0; P < 3; ) D[I*4+P] = f[I*3+P++]/K*255;
    D[I++ *4 +3] = 255;
    // D[I*4] = 255;
  }
  
  K++;

  a.putImageData( T,0,0 );    
  
  //and start the loop over
  setTimeout(B);
}

B();
