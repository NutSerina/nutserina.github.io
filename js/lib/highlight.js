mixins.highlight={data(){return{copying:!1}},created(){hljs.configure({ignoreUnescapedHTML:!0}),this.renderers.push(this.highlight)},methods:{sleep(i){return new Promise(e=>setTimeout(e,i))},highlight(){var t;for(t of document.querySelectorAll("pre")){let e=t.textContent;var c=[...t.classList,...t.firstChild.classList][0]||"plaintext";let i;try{i=hljs.highlight(e,{language:c}).value}catch{i=e}t.innerHTML=`
                <div class="code-content hljs">${i}</div>
                <div class="language">${c}</div>
                <div class="copycode">
                    <i class="fa-solid fa-copy fa-fw"></i>
                    <i class="fa-solid fa-check fa-fw"></i>
                </div>
                `;c=t.querySelector(".code-content");hljs.lineNumbersBlock(c,{singleLine:!0});let s=t.querySelector(".copycode");s.addEventListener("click",async()=>{this.copying||(this.copying=!0,s.classList.add("copied"),await navigator.clipboard.writeText(e),await this.sleep(1e3),s.classList.remove("copied"),this.copying=!1)})}}}};