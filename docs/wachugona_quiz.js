"use strict";

window.addEventListener("DOMContentLoaded", () => {
	const elems = {};
	document.querySelectorAll("[id]").forEach((elem) => elems[elem.id] = elem);

	// オブジェクト(JSON) → base64url
	function objToStr(obj) {
		const b64 = btoa(Array.from(new TextEncoder().encode(JSON.stringify(obj))).map((c) => String.fromCharCode(c)).join(""));
		return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
	}

	// オブジェクト(JSON) ← base64url
	function strToObj(str) {
		try {
			const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
			const decoded = new TextDecoder("utf-8", {fatal: true}).decode(new Uint8Array(Array.from(atob(b64)).map((c) => c.charCodeAt(0))));
			return JSON.parse(decoded);
		} catch (e) {
			console.warn(e);
			return null;
		}
	}

	// 開発用
	/*
	const quizData = [
		{ name: "chara-1", isCV: false, answer: 1 },
		{ name: "cv-1", isCV: true, answer: 1 },
		{ name: "chara-2", isCV: false, answer: 2 },
		{ name: "cv-2", isCV: true, answer: 2},
	];
	*/
	// ソースコードを見ただけでネタバレしにくいよう、データをbase64urlエンコードして格納する
	const quizData = strToObj("W3sibmFtZSI6IuS4remgiOOBi-OBmeOBvyIsImlzQ1YiOmZhbHNlLCJhbnN3ZXIiOjF9LHsibmFtZSI6IuebuOiJr-iMieWEqiIsImlzQ1YiOnRydWUsImFuc3dlciI6MX0seyJuYW1lIjoi5qGc5Z2C44GX44Ga44GPIiwiaXNDViI6ZmFsc2UsImFuc3dlciI6MX0seyJuYW1lIjoi5YmN55Sw5L2z57mU6YeMIiwiaXNDViI6dHJ1ZSwiYW5zd2VyIjoxfSx7Im5hbWUiOiLlpKnnjovlr7rnkoPlpYgiLCJpc0NWIjpmYWxzZSwiYW5zd2VyIjoxfSx7Im5hbWUiOiLnlLDkuK3jgaHjgYjnvo4iLCJpc0NWIjp0cnVlLCJhbnN3ZXIiOjF9LHsibmFtZSI6IuS4ieiIueagnuWtkCIsImlzQ1YiOmZhbHNlLCJhbnN3ZXIiOjF9LHsibmFtZSI6IuWwj-azieiQjOmmmSIsImlzQ1YiOnRydWUsImFuc3dlciI6MX0seyJuYW1lIjoi5LiK5Y6f5q2p5aSiIiwiaXNDViI6ZmFsc2UsImFuc3dlciI6Mn0seyJuYW1lIjoi5aSn6KW_5Lqc546W55KDIiwiaXNDViI6dHJ1ZSwiYW5zd2VyIjoyfSx7Im5hbWUiOiLlrq7kuIsg5oSbIiwiaXNDViI6ZmFsc2UsImFuc3dlciI6Mn0seyJuYW1lIjoi5p2R5LiK5aWI5rSl5a6fIiwiaXNDViI6dHJ1ZSwiYW5zd2VyIjoyfSx7Im5hbWUiOiLlhKrmnKjjgZvjgaToj5wiLCJpc0NWIjpmYWxzZSwiYW5zd2VyIjoyfSx7Im5hbWUiOiLmpaDmnKjjgajjgoLjgooiLCJpc0NWIjp0cnVlLCJhbnN3ZXIiOjJ9LHsibmFtZSI6IumQmCDltZDnj6AiLCJpc0NWIjpmYWxzZSwiYW5zd2VyIjoyfSx7Im5hbWUiOiLms5XlhYPmmI7oj5wiLCJpc0NWIjp0cnVlLCJhbnN3ZXIiOjJ9LHsibmFtZSI6IuacnemmmeaenOaelyIsImlzQ1YiOmZhbHNlLCJhbnN3ZXIiOjN9LHsibmFtZSI6IuS5heS_neeUsOacquWkoiIsImlzQ1YiOnRydWUsImFuc3dlciI6M30seyJuYW1lIjoi6L-R5rGf5b285pa5IiwiaXNDViI6ZmFsc2UsImFuc3dlciI6M30seyJuYW1lIjoi6ay86aCt5piO6YeMIiwiaXNDViI6dHJ1ZSwiYW5zd2VyIjozfSx7Im5hbWUiOiLjgqjjg57jg7vjg7Tjgqfjg6vjg4ciLCJpc0NWIjpmYWxzZSwiYW5zd2VyIjozfSx7Im5hbWUiOiLmjIflh7rmr6zkupwiLCJpc0NWIjp0cnVlLCJhbnN3ZXIiOjN9LHsibmFtZSI6IuODn-OCouODu-ODhuOCpOODqeODvCIsImlzQ1YiOmZhbHNlLCJhbnN3ZXIiOjN9LHsibmFtZSI6IuWGheeUsCDnp4AiLCJpc0NWIjp0cnVlLCJhbnN3ZXIiOjN9XQ");

	let mode = null;
	let gameModeText = "";
	let acCount = 0;
	const quizIndice = [];
	const quizAnswers = [];

	function nextQuiz() {
		if (quizAnswers.length >= quizIndice.length) {
			initResult(false);
		} else {
			elems.questionCountArea.textContent = `問題 ${quizAnswers.length + 1} / ${quizIndice.length}`;
			elems.queryArea.textContent = quizData[quizIndice[quizAnswers.length]].name;
			elems.querySubArea.textContent = "はどれ？";
		}
	}

	function initTitle() {
		elems.questionCountArea.classList.add("hidden");
		elems.queryArea.classList.add("hidden");
		elems.confusionMatrixArea.classList.add("removed");
		elems.answerDetailArea.classList.add("removed");
		elems.button2.classList.remove("removed");
		elems.button3.classList.remove("removed");
		elems.querySubArea.textContent = "モードを選択してください。";
		elems.button1.textContent = "キャラクターを分類する";
		elems.button2.textContent = "声優を分類する";
		elems.button3.textContent = "キャラクターと声優を分類する";
		mode = "title";
	}

	function initQuiz(useCharacters, useCV) {
		elems.questionCountArea.classList.remove("hidden");
		elems.queryArea.classList.remove("hidden");
		elems.confusionMatrixArea.classList.add("removed");
		elems.answerDetailArea.classList.add("removed");
		elems.button2.classList.remove("removed");
		elems.button3.classList.remove("removed");
		elems.querySubArea.textContent = "はどれ？";
		elems.button1.textContent = "1年生";
		elems.button2.textContent = "2年生";
		elems.button3.textContent = "3年生";
		mode = "quiz";
		if (useCharacters && useCV) gameModeText = "キャラクターと声優";
		else if (useCharacters) gameModeText = "キャラクター";
		else if (useCV) gameModeText = "声優";
		else gameModeText = "奴";
		// 選択されたモードに合うデータを出題リストに入れる
		quizIndice.splice(0);
		for (let i = 0; i < quizData.length; i++) {
			if (quizData[i].isCV ? useCV : useCharacters) quizIndice.push(i);
		}
		// 出題リストをシャッフルする
		for (let i = quizIndice.length - 1; i > 0; i--) {
			const pos = ~~(Math.random() * (i + 1));
			const temp = quizIndice[i];
			quizIndice[i] = quizIndice[pos];
			quizIndice[pos] = temp;
		}
		// クイズの出題を開始する
		quizAnswers.splice(0);
		nextQuiz();
	}

	function initResult(shared) {
		const confusionMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // confusionMatrix[正解][解答]
		const answerDetailTableBody = document.createElement("tbody");
		acCount = 0;
		for (let i = 0; i < quizIndice.length; i++) {
			const correct = quizData[quizIndice[i]].answer;
			const selected = quizAnswers[i];
			if (correct === selected) acCount++;
			if (1 <= correct && correct <= 3 && 1 <= selected && selected <= 3) {
				confusionMatrix[correct - 1][selected - 1]++;
			}
			const answerDetailRow = document.createElement("tr");
			if (correct !== selected) answerDetailRow.classList.add("wrong");
			const questionCell = document.createElement("td");
			questionCell.appendChild(document.createTextNode(quizData[quizIndice[i]].name));
			answerDetailRow.appendChild(questionCell);
			const correctCell = document.createElement("td");
			correctCell.appendChild(document.createTextNode(`${correct}年生`));
			answerDetailRow.appendChild(correctCell);
			const selectedCell = document.createElement("td");
			selectedCell.appendChild(document.createTextNode(`${selected}年生`));
			answerDetailRow.appendChild(selectedCell);
			answerDetailTableBody.appendChild(answerDetailRow);
		}
		const confusionMatrixTableBody = document.createElement("tbody");
		const confusionMatrixTableRow1 = document.createElement("tr");
		const confusionMatrixTableRow1Cell1 = document.createElement("td");
		confusionMatrixTableRow1Cell1.setAttribute("rowspan", "2");
		confusionMatrixTableRow1Cell1.setAttribute("colspan", "2");
		confusionMatrixTableRow1.appendChild(confusionMatrixTableRow1Cell1);
		const confusionMatrixTableRow1Cell2 = document.createElement("td");
		confusionMatrixTableRow1Cell2.setAttribute("colspan", "3");
		confusionMatrixTableRow1Cell2.appendChild(document.createTextNode("解答"));
		confusionMatrixTableRow1.appendChild(confusionMatrixTableRow1Cell2);
		confusionMatrixTableBody.appendChild(confusionMatrixTableRow1);
		const confusionMatrixTableRow2 = document.createElement("tr");
		for (let i = 0; i < 3; i++) {
			const cell = document.createElement("td");
			cell.appendChild(document.createTextNode(`${i + 1}年生`));
			confusionMatrixTableRow2.appendChild(cell);
		}
		confusionMatrixTableBody.appendChild(confusionMatrixTableRow2);
		for (let i = 0; i < 3; i++) {
			const row = document.createElement("tr");
			if (i === 0) {
				const cell = document.createElement("td");
				cell.classList.add("verticalLabel");
				cell.setAttribute("rowspan", "3");
				if (false) {
					const labelDiv = document.createElement("div");
					labelDiv.appendChild(document.createTextNode("正解"));
					labelDiv.setAttribute("style", "border: 1px solid transparent");
					cell.appendChild(labelDiv);
				} else {
					cell.appendChild(document.createTextNode("正解"));
				}
				row.appendChild(cell);
			}
			const choiceCell = document.createElement("td");
			choiceCell.appendChild(document.createTextNode(`${i + 1}年生`));
			row.appendChild(choiceCell);
			for (let j = 0; j < 3; j++) {
				const cell = document.createElement("td");
				const num = confusionMatrix[i][j];
				if (num > 0) cell.appendChild(document.createTextNode(num));
				row.appendChild(cell);
			}
			confusionMatrixTableBody.appendChild(row);
		}

		while (confusionMatrixArea.firstChild) {
			confusionMatrixArea.removeChild(confusionMatrixArea.firstChild);
		}
		const confusionMatrixTable = document.createElement("table");
		const confusionMatrixTableCaption = document.createElement("caption");
		confusionMatrixTableCaption.appendChild(document.createTextNode("混同行列"));
		confusionMatrixTable.appendChild(confusionMatrixTableCaption);
		confusionMatrixTable.appendChild(confusionMatrixTableBody);
		confusionMatrixArea.appendChild(confusionMatrixTable);

		while (answerDetailArea.firstChild) {
			answerDetailArea.removeChild(answerDetailArea.firstChild);
		}
		const answerDetailTable = document.createElement("table");
		const answerDetailTableHead = document.createElement("thead");
		const answerDetailTableHeadRow = document.createElement("tr");
		const answerDetailTableQueryCell = document.createElement("th");
		answerDetailTableQueryCell.appendChild(document.createTextNode("問題"));
		answerDetailTableHeadRow.appendChild(answerDetailTableQueryCell);
		const answerDetailTableCorrectCell = document.createElement("th");
		answerDetailTableCorrectCell.appendChild(document.createTextNode("正解"));
		answerDetailTableHeadRow.appendChild(answerDetailTableCorrectCell);
		const answerDetailTableSelectedCell = document.createElement("th");
		answerDetailTableSelectedCell.appendChild(document.createTextNode("解答"));
		answerDetailTableHeadRow.appendChild(answerDetailTableSelectedCell);
		answerDetailTableHead.appendChild(answerDetailTableHeadRow);
		answerDetailTable.appendChild(answerDetailTableHead);
		answerDetailTable.appendChild(answerDetailTableBody);
		if (shared) {
			const answerDetails = document.createElement("details");
			const answerSummary = document.createElement("summary");
			answerSummary.appendChild(document.createTextNode("解答詳細 (ネタバレ注意)"));
			answerDetails.appendChild(answerSummary);
			answerDetails.appendChild(answerDetailTable);
			answerDetailArea.appendChild(answerDetails);
		} else {
			const answerDetailTableCaption = document.createElement("caption");
			answerDetailTableCaption.appendChild(document.createTextNode("解答詳細"));
			answerDetailTable.insertBefore(answerDetailTableCaption, answerDetailTable.firstChild);
			answerDetailArea.appendChild(answerDetailTable);
		}

		elems.questionCountArea.classList.remove("hidden");
		elems.queryArea.classList.remove("hidden");
		elems.confusionMatrixArea.classList.remove("removed");
		elems.answerDetailArea.classList.remove("removed");
		if (shared) {
			elems.button2.classList.add("removed");
		} else {
			elems.button2.classList.remove("removed");
		}
		elems.button3.classList.add("removed");
		elems.questionCountArea.textContent = `${quizIndice.length} 問中`;
		elems.queryArea.textContent = `${acCount} 問正解`;
		elems.querySubArea.textContent =
			quizIndice.length === acCount ? (shared ? "全問正解！" : "全問正解！やったね！") :
			(shared ? "でした。" : "お疲れ様でした。");
		elems.button1.textContent = shared ? "クイズに挑戦！" : "最初に戻る";
		elems.button2.textContent = "結果をポスト (ツイート) する";
		mode = shared ? "result-shared" : "result";
	}

	function postResult() {
		const resultObj = {
			version: 1,
			questions: quizIndice,
			answers: quizAnswers,
		};
		const resultURL = new URL(location.href);
		resultURL.hash = objToStr(resultObj);
		const resultText =
			"『わちゅごなどぅー』を歌っている" +
			gameModeText +
			quizIndice.length +
			"人中" +
			acCount +
			"人について、何年生かを正しく分類できました！";
		const postURL = new URL("https://twitter.com/intent/tweet");
		postURL.searchParams.set("text", resultText);
		postURL.searchParams.set("url", resultURL.href);
		postURL.searchParams.set("hashtags", "わちゅごな分類クイズ");
		window.open(postURL.href, "_blank", "noopener");
	}

	function proceed(choice) {
		switch (mode) {
			case "title":
				initQuiz(choice === 1 || choice === 3, choice === 2 || choice === 3);
				break;
			case "quiz":
				quizAnswers.push(choice);
				nextQuiz();
				break;
			case "result":
				if (choice === 1) {
					initTitle();
				} else if (choice === 2) {
					postResult();
				}
				break;
			case "result-shared":
				if (choice === 1) {
					removeHash();
					initTitle();
				}
				break;
		}
	}

	function enableButtons(enable) {
		elems.button1.disabled = !enable;
		elems.button2.disabled = !enable;
		elems.button3.disabled = !enable;
	}

	let acceptClick = true;
	function clickButton(buttonId) {
		if (!acceptClick) return;
		if (buttonId === 2 && mode === "result") {
			// ポストはすぐに行う
			proceed(buttonId);
		} else {
			enableButtons(false);
			acceptClick = false;
			if (mode === "quiz") {
				// 押したボタンに対応する解答を表示する
				elems.querySubArea.textContent = `は${buttonId}年生！`;
			}
			setTimeout(() => {
				proceed(buttonId);
				enableButtons(true);
				acceptClick = true;
			}, 500);
		}
	}

	elems.button1.addEventListener("click", () => clickButton(1));
	elems.button2.addEventListener("click", () => clickButton(2));
	elems.button3.addEventListener("click", () => clickButton(3));
	document.addEventListener("keydown", (event) => {
		switch (event.key) {
			case "1": clickButton(1); break;
			case "2": clickButton(2); break;
			case "3": clickButton(3); break;
		}
	});

	function removeHash() {
		const url = new URL(location.href);
		url.hash = "";
		history.pushState(null, "", url.href);
	}

	function loadHash() {
		const hash = location.hash.substring(1);
		if (hash.length === 0) return false;
		const obj = strToObj(hash);
		if (
			obj === null ||
			obj.version !== 1 ||
			!Array.isArray(obj.questions) ||
			!Array.isArray(obj.answers) ||
			obj.questions.length !== obj.answers.length
		) return false;
		for (let i = 0; i < obj.questions.length; i++) {
			const q = obj.questions[i], a = obj.answers[i];
			if (
				q !== ~~q || q < 0 || quizData.length <= q ||
				a !== ~~a || a < 1 || 3 < a
			) return false;
		}
		quizIndice.splice(0);
		obj.questions.forEach((e) => quizIndice.push(e));
		quizAnswers.splice(0);
		obj.answers.forEach((e) => quizAnswers.push(e));
		initResult(true);
		return true;
	}

	function tryLoadHash() {
		if (!loadHash()) {
			removeHash();
			initTitle();
		}
	}

	window.addEventListener("hashchange", tryLoadHash);
	tryLoadHash();
});
