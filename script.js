//functions used
function prior(sign) {
    if (sign=='/'||sign=='*') return 2;
    if (sign=='+'||sign=='-') return 1;
    if (sign=='(') return 0;
    else return -1;
}
function convert(t) {
    let s=1;
    let ansl=0;
    let ansr=0;
    let pt=0;
    let c=-1;
    for (let i=0;i<t.length;i++) {
        if (i==0&&t[i]=='-') s=-1;
        else if (t[i]=='.') {
            pt=1;
            i=t.length;
            }
        else ansl=ansl*10+(t[i]-"0");
    }
    if (pt==0) return s*ansl;
    for (let i=t.length-1;i>=0;i--) {
        if (t[i]=='.') i=-1;
        else ansr=(ansr+(t[i]-"0"))/10;
    }
    return s*(ansl+ansr);
}

let er=0;
function calc(str) {
    let s=[];
    let ans=[];
    let t="";
    let ptcnt=0;
    for (let i=0;i<str.length;i++) {
        if (str[i]=='(') s.push(str[i]);
        else if (str[i]==')') {
            if (s.length==0) {er=1;return -1;}
            while (s[s.length-1]!='(') {
                ans.push(s[s.length-1]);
                s.pop();
                if (s.length==0) {er=1;return -1;}
            }
            s.pop();
        }
        else if (str[i]=='-') {
            if (i==str.length-1) {er=1;return -1;}
            else if (i==0) t+='-';
            else if (str[i+1]==')'||str[i+1]=='.') {er=1;return -1;}
            else if (str[i+1]>="0"&&str[i+1]<="9") {
                if (str[i-1]=='+'||str[i-1]=='-'||str[i-1]=='*'||str[i-1]=='/'||str[i-1]=='(') {
                    if (t.length==0) t+="-";
                    else {er=1;return -1;}

                }
                else if (str[i-1]=='.') {er=1;return -1;}
                else {
                    while (s.length>0&&prior(s[s.length-1])>=prior("-")) {
                        ans.push(s[s.length-1]);
                        s.pop();
                    }
                    s.push("-");
                }
            }
            else {
                while (s.length>0&&prior(s[s.length-1])>=prior("-")) {
                    ans.push(s[s.length-1]);
                    s.pop();
                }
                s.push("-");
            }
        }
        else if (str[i]=='+'||str[i]=='*'||str[i]=='/') {
            while (s.length>0&&prior(s[s.length-1])>=prior(str[i])) {
                ans.push(s[s.length-1]);
                s.pop();
            }
            s.push(str[i]);
        }
        else {
            if (str[i]==".") {
                if (i==0||i==str.length-1||ptcnt==1) {er=1;return -1;}
                if (str[i+1]<"0"||str[i+1]>"9"||str[i-1]<"0"||str[i-1]>"9") {er=1;return -1;}
            }
            t+=str[i];
            
            if (i==str.length-1) {
                ans.push(convert(t));
                t="";
                ptcnt=0;
            }
            else if (str[i+1]!="."&&(str[i+1]>"9"||str[i+1]<"0")) {
                ans.push(convert(t));
                t="";
                ptcnt=0;
            }
        }
    }
    while (s.length>0) {
        if (s[s.length-1]=='(') {er=1;return -1;}
        ans.push(s[s.length-1]);
        s.pop();
    }
    for (let i=0;i<ans.length;i++) {
        if (ans[i]=='-'||ans[i]=='+'||ans[i]=='*'||ans[i]=='/') {
            if (s.length<2) {er=1;return -1;}
            let b=s[s.length-1]; s.pop();
            let a=s[s.length-1]; s.pop();
            if (ans[i]=='/'&&b==0) {er=1;return -1;}
            if (ans[i]=='+') s.push(a+b);
            if (ans[i]=='-') s.push(a-b);
            if (ans[i]=='*') s.push(a*b);
            if (ans[i]=='/') s.push(a/b);
        }
        else s.push(ans[i]);
    }
    if (s.length!=1) {er=1;return -1;}
    return s[s.length-1];
}

//init
let button=document.getElementsByClassName('btn');
let text=document.getElementsByClassName('text');
let io=0;
for (let i=0;i<20;i++) {
    button[i].addEventListener("click",()=>{
        if (i!=0&&i!=16&&i!=19) {
            if (io==1) {
                io=0;
                text[0].innerText=""; 
            }
            text[0].innerText+=button[i].innerText; 
        }
        else if (i==0) {
            if (io==1) {
                io=0;
                text[0].innerText=""; 
            }
            text[0].innerText=text[0].innerText.slice(0,-1);
        }
        else if (i==16) {
            text[0].innerText="";
        }
        else if (i==19) {
            let answer=calc(text[0].innerText);
            if (er==1) {
                text[0].innerText="Bad Expression";
                er=0;
                io=1;
            }
            else {
                text[0].innerText=`${answer}`;
                er=0;
                io=1;
            }
        }
    })
}


