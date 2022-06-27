import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, createElement } from 'react';

export default function Home() {

  // 設定ボタン
  const [hasSetting1,set1] = useState(undefined); // 現在の状態を知るために必要

  const handleSet1 = (e) => {
    set1(e.target.checked); // e.target.checked(=true/false)を、hasSetting1に入れる。これをchecked={}に入れることで実際に変えられる
  };

  useEffect(() => { // 第2引数で発火のタイミングを決められる
    if(hasSetting1 !== undefined) {
      if(hasSetting1) {
        document.getElementById('setting1').checked = true;
        window.localStorage.setItem('setting1','true'); // ローカルストレージには文字列しか入れられないので注意
      } else {
        document.getElementById('setting1').checked = false;
        window.localStorage.setItem('setting1','false');
      }
    }
  }, [hasSetting1]) // hasSetting1 が切り替わるたびにこれが呼び出される


  // textをコピー
  const [textVal,textarea] = useState(undefined); // 現在の状態を知るために必要
  const toHtml = (e) => {     // e.target = this（タグ含む）
    textarea(e.target.value); // e.target.vakue → textVal に代入
  };
  useEffect(() => { // 第2引数で発火のタイミングを決められる
    if(textVal !== undefined) {
      let i = textVal;

      document.getElementById('text-post').innerHTML = i.replace(/\n/g,"<br>");
      document.getElementById('copy-message').innerHTML = '';
    };
  }, [textVal]) // hasSetting1 が切り替わるたびにこれが呼び出される


  // 文字編集
  const func1 = (text,css) => {
    if(text !== "") {
      //https://qiita.com/umanoda/items/1042071b038a758b8663
      var sel = window.getSelection();
      console.log(sel.toString());
      if(!sel.rangeCount) return; //範囲選択されている箇所がない場合は何もせず終了
      console.log(window.getSelection().anchorNode.parentElement); //
      var dom = window.getSelection().anchorNode.parentElement; // selectionは画面上に出てる選択範囲で、rangeはそれを元に加工したりした架空の範囲

      var range = sel.getRangeAt(0);
      var span  = document.createElement('span');
      var span2  = document.createElement('span');
      var span3 = document.createElement('span');
      span.setAttribute('class', css);
      span3.setAttribute('class', css);
      var select = sel.toString();
      var all = dom.innerHTML;

      if(dom.classList.contains(css)) { // すでにspanタグ内にある場合：選択箇所とその前後の３つに分離→１と３はspanつける→改めて３つくっつけ、置き換える
        // spanタグ内を３つに分割
        var text1 = all.substring( 0, range.startOffset );
        var text3 = all.substring( range.endOffset, all.length );

        // ３つのspanタグを調整
        dom.classList.remove(css);
        
        var classList = dom.className.split(' ');
        if(classList.length>1) {
          
          for(let i=0;i<classList.length;i++) {
            span.classList.add(classList[i]);
            span2.classList.add(classList[i]);
            span3.classList.add(classList[i]);
          }
        }
        span.innerHTML  = text1;
        span2.innerHTML = select;
        span3.innerHTML = text3;

        // もとのspanタグを３つのspanタグに置き換え
        //dom.deleteContents();    // 範囲選択箇所を含む親domをタグごと削除。３つに分割されるが、いずれにもredst以外の元ついてたクラスはつけなおす
        if(span.innerHTML !== '') dom.before(span); // 前後が空白（選択箇所がspanの端）だった場合は追加しない
        dom.before(span2);
        if(span3.innerHTML !== '') dom.before(span3);
        dom.remove();
      } else { // spanタグ内になければ、そのままspanタグにいれた選択箇所を追加
        range.deleteContents();    // 範囲選択箇所を一旦削除
        span.innerHTML = select;
        range.insertNode(span); // 範囲選択箇所の先頭から、修飾したspanを挿入
      }
      console.log(span);
      
      window.getSelection().removeAllRanges();
      document.getElementById('copy-message').innerHTML = '';
    };
  }

  // 文字の切り替え
  const [text_red,text_r] = useState(undefined); // 赤
  const toRedst = (e) => {
    text_r(String(window.getSelection()));
  };
  useEffect(() => {
    func1(text_red,'redst');
  }, [text_red])
  
  const [text_bold,text_b] = useState(undefined); // 太
  const toBolds = (e) => {
    text_b(String(window.getSelection()));
  };
  useEffect(() => {
    func1(text_bold,'bolds');
  }, [text_bold])
  
  const [text_italic,text_i] = useState(undefined); // 斜
  const toItalics = (e) => {
    text_i(String(window.getSelection()));
  };
  useEffect(() => {
    func1(text_italic,'italics');
  }, [text_italic])
  
  const [text_under,text_u] = useState(undefined); // 下線
  const toUnders = (e) => {
    text_u(String(window.getSelection()));
  };
  useEffect(() => {
    func1(text_under,'unders');
  }, [text_under])

  const [text_b_u,text_bu] = useState(undefined); // 下線
  const toBU = (e) => {
    text_bu(String(window.getSelection()));
  };
  useEffect(() => {
    func1(text_b_u,'bu');
  }, [text_b_u])


  // コピー
  const cp = () => {
    var copy_text = document.getElementById('text-post').innerHTML;
    navigator.clipboard.writeText(copy_text).then(() => {
      console.log("copied");
      console.log(copy_text);
      document.getElementById('copy-message').innerHTML = 'コピーしました！';
    });
  }

  const copyCSS = () => {
    // style.cssをこのサイト自体で改行なしに → Tab空白を\tに、<br>を\nに手動で直す
    var copy_text = '.redst {\n\tcolor: red;\n\tfont-weight: bold;\n}\n.red {\n\tcolor: red;\n}\n.bolds {\n\tfont-weight: bold;\n}\n.italics {\n\tfont-style: italic;\n}\n.unders {\n\ttext-decoration: underline;\n}';
    navigator.clipboard.writeText(copy_text).then(() => {
      console.log("copied");
      console.log(copy_text);
      document.getElementById('copy-message-css').innerHTML = 'コピーしました！';
    });
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Text to HTML</title>
      </Head>

      <header className={styles.header}>
        <h1>Text → HTML 自動変換ツール</h1>
      </header>

      <main>
        <section className={styles.section_contents}>
          <h2>０，CSSをコピー</h2>
          <p>下記ボタンを押し、CSSに貼ってください。（初回のみ）</p>
          <div>
            <button className={styles.copy_btn} onClick={copyCSS}>Copy CSS</button>
            <span id='copy-message-css'></span>
          </div>

          <h2>１，文章を入力</h2>
          <div>
            <form>
              <textarea className={styles.text_input} onChange={toHtml} />
            </form>
          </div>
          
          <div>
            <p>▼</p>
          </div>

          <h2>２，編集</h2>
          <div>
            <button className={`${styles.edit_btn} redst`} onClick={toRedst}>Red</button>
            <button className={`${styles.edit_btn} bolds`} onClick={toBolds}>B</button>
            <button className={`${styles.edit_btn} italics`} onClick={toItalics}>I</button>
            <button className={`${styles.edit_btn} unders`} onClick={toUnders}>U</button>
            <button className={`${styles.edit_btn} bu`} onClick={toBU}>B+U</button>
          </div>
          <div>
            <button className={styles.copy_btn} onClick={cp}>Copy</button>
            <span id='copy-message'></span>
          </div>
          <div className={styles.text_post_div}>
            <p id='text-post'></p>
          </div>

          <div className={styles.setting_div}>
            <p>詳細設定</p>
            <p><label><input id='setting1' type='checkbox' onChange={handleSet1} checked={hasSetting1} />改行しない</label></p>
            <p><label><input id='setting1' type='checkbox' onChange={handleSet1} checked={hasSetting1} />赤文字を太くする</label></p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <small>©2022 Ryotaro Nakabayashi</small>
      </footer>
    </div>
  )
}

/*

function setInitial() { // ローカルストレージから前回の設定を読み込み・適応
  const stored = window.localStorage.getItem('setting1');
  if(typeof stored === 'string') { // ローカルストレージは「文字列しか入れられない」ので注意
    if(stored === 'true') {
        document.getElementById('setting1').checked = true;
    } else {
        document.getElementById('setting1').checked = false;
    }
  }
  /*
  if(window.matchMedia('(min-width: 600px)').matches) { // 指定された文字列のオブジェクトを返す。if文内に入れれば、今回ならレスポンシブかどうかで処理を変えられる
    document.getElementById('setting1').checked = true; // すでに以前ユーザーが設定を変更していた場合、そこにチェックを入れる/外す
}
setInitial();
*/