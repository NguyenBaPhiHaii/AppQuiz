// Chọn tất cả các phần tử cần thiết
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

// nếu nút startQuiz được nhấp
start_btn.onclick = () => {
    info_box.classList.add("activeInfo"); //hiện hộp thông tin
}

// nếu nhấn vào nút exitQuiz
exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); //ẩn hộp thông tin
}

// nếu nút continueQuiz được nhấp
continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); //ẩn hộp thông tin
    quiz_box.classList.add("activeQuiz"); //hiện hộp câu đố
    showQuetions(0); //gọi hàm showQuetions
    queCounter(1); //truyền 1 tham số cho queCounter
    startTimer(15); //gọi hàm startTimer
    startTimerLine(0); //gọi hàm startTimerLine
}

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// Nếu nhấn vào nút restartQuiz
restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz"); // Hiển thị hộp câu đố
    result_box.classList.remove("activeResult"); // Ẩn hộp kết quả
    timeValue = 15;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;

    // Sáo trộn lại các câu hỏi trong mảng trước khi chơi lại
    questions = shuffleArray(questions);

    showQuetions(que_count); // Gọi hàm showQuetions
    queCounter(que_numb); // Truyền giá trị que_numb cho hàm queCounter
    clearInterval(counter); // Xóa bộ đếm
    clearInterval(counterLine); // Xóa bộ đếm thanh tiến trình
    startTimer(timeValue); // Gọi hàm startTimer
    startTimerLine(widthValue); // Gọi hàm startTimerLine
    timeText.textContent = "Thời gian còn lại"; // Thay đổi văn bản của timeText thành "Thời gian còn lại"
    next_btn.classList.remove("show"); // Ẩn nút next
}

// nếu nhấn vào nút quitQuiz
quit_quiz.onclick = () => {
    window.location.reload(); //tải lại cửa sổ hiện tại
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// nếu nhấn vào nút Next Que
next_btn.onclick = () => {
    if (que_count < questions.length - 1) { //nếu số câu hỏi nhỏ hơn tổng số câu hỏi
        que_count++; //tăng giá trị que_count
        que_numb++; //tăng giá trị que_numb
        showQuetions(que_count); //gọi hàm showQuetions
        queCounter(que_numb); //truyền giá trị que_numb cho hàm queCounter
        clearInterval(counter); //xóa bộ đếm
        clearInterval(counterLine); //xóa bộ đếm thanh tiến trình
        startTimer(timeValue); //gọi hàm startTimer
        startTimerLine(widthValue); //gọi hàm startTimerLine
        timeText.textContent = "Thời gian còn lại"; //thay đổi văn bản của timeText thành "Thời gian còn lại"
        next_btn.classList.remove("show"); //ẩn nút next
    } else {
        clearInterval(counter); //xóa bộ đếm
        clearInterval(counterLine); //xóa bộ đếm thanh tiến trình
        showResult(); //gọi hàm showResult
    }
}
// Hàm sáo trộn mảng
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
// lấy câu hỏi và tùy chọn từ mảng
function showQuetions(index) {
    const que_text = document.querySelector(".que_text");

    //tạo một thẻ span và thẻ div mới cho câu hỏi và tùy chọn và truyền giá trị bằng chỉ số mảng
    let que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
    let option_tag = '<div class="option"><span>' + questions[index].options[0] + '</span></div>'
        + '<div class="option"><span>' + questions[index].options[1] + '</span></div>'
        + '<div class="option"><span>' + questions[index].options[2] + '</span></div>'
        + '<div class="option"><span>' + questions[index].options[3] + '</span></div>';
    que_text.innerHTML = que_tag; //thêm thẻ span mới vào trong que_tag
    option_list.innerHTML = option_tag; //thêm thẻ div mới vào trong option_tag

    const option = option_list.querySelectorAll(".option");

    // thiết lập thuộc tính onclick cho tất cả các tùy chọn có sẵn
    for (i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

// tạo thẻ div mới cho biểu tượng
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// nếu người dùng nhấp vào tùy chọn
function optionSelected(answer) {
    clearInterval(counter); //xóa bộ đếm
    clearInterval(counterLine); //xóa bộ đếm thanh tiến trình
    let userAns = answer.textContent; //lấy tùy chọn được chọn bởi người dùng
    let correcAns = questions[que_count].answer; //lấy câu trả lời đúng từ mảng
    const allOptions = option_list.children.length; //lấy tất cả các tùy chọn

    if (userAns == correcAns) { //nếu tùy chọn được chọn bởi người dùng bằng với câu trả lời đúng của mảng
        userScore += 1; //tăng giá trị điểm của người dùng lên 1
        answer.classList.add("correct"); //thêm màu xanh lá cây cho tùy chọn được chọn đúng
        answer.insertAdjacentHTML("beforeend", tickIconTag); //thêm biểu tượng đánh dấu đúng vào tùy chọn được chọn
        console.log("Câu trả lời đúng");
        console.log("Số câu trả lời đúng của bạn = " + userScore);
    } else {
        answer.classList.add("incorrect"); //thêm màu đỏ cho tùy chọn được chọn sai
        answer.insertAdjacentHTML("beforeend", crossIconTag); //thêm biểu tượng đánh dấu sai vào tùy chọn được chọn
        console.log("Câu trả lời sai");

        for (i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correcAns) { //nếu có một tùy chọn trùng với câu trả lời đúng của mảng
                option_list.children[i].setAttribute("class", "option correct"); //thêm màu xanh lá cây vào tùy chọn trùng khớp
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //thêm biểu tượng đánh dấu đúng vào tùy chọn trùng khớp
                console.log("Đã tự động chọn câu trả lời đúng.");
            }
        }
    }
    for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //sau khi người dùng chọn một tùy chọn thì vô hiệu hóa tất cả các tùy chọn
    }
    next_btn.classList.add("show"); //hiển thị nút next nếu người dùng đã chọn bất kỳ tùy chọn nào
}

function showResult() {
    info_box.classList.remove("activeInfo"); //ẩn hộp thông tin
    quiz_box.classList.remove("activeQuiz"); //ẩn hộp câu đố
    result_box.classList.add("activeResult"); //hiển thị hộp kết quả
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 3) { //nếu người dùng đạt được số điểm lớn hơn 3
        //tạo thẻ span mới và truyền số điểm của người dùng và tổng số câu hỏi
        let scoreTag = '<span>và xin chúc mừng! 🎉, Bạn đã đạt được <p>' + userScore + '</p> trong số <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;  //thêm thẻ span mới vào trong scoreText
    } else if (userScore > 1) { //nếu người dùng đạt được số điểm lớn hơn 1
        let scoreTag = '<span>và tốt lắm 😎, Bạn đã đạt được <p>' + userScore + '</p> trong số <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    } else { //nếu người dùng đạt được số điểm nhỏ hơn 1
        let scoreTag = '<span>và xin lỗi 😐, Bạn chỉ đạt được <p>' + userScore + '</p> trong số <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time; //thay đổi giá trị của timeCount bằng giá trị thời gian
        time--; //giảm giá trị thời gian
        if (time < 9) { //nếu thời gian nhỏ hơn 9
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero; //thêm số 0 vào trước giá trị thời gian
        }
        if (time < 0) { //nếu thời gian nhỏ hơn 0
            clearInterval(counter); //xóa bộ đếm
            timeText.textContent = "Hết thời gian"; //thay đổi văn bản của timeText thành "Hết thời gian"
            const allOptions = option_list.children.length; //lấy tất cả các tùy chọn
            let correcAns = questions[que_count].answer; //lấy câu trả lời đúng từ mảng
            for (i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent == correcAns) { //nếu có một tùy chọn trùng với câu trả lời đúng của mảng
                    option_list.children[i].setAttribute("class", "option correct"); //thêm màu xanh lá cây vào tùy chọn trùng khớp
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //thêm biểu tượng đánh dấu đúng vào tùy chọn trùng khớp
                    console.log("Hết thời gian: Đã tự động chọn câu trả lời đúng.");
                }
            }
            for (i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled"); //sau khi người dùng chọn một tùy chọn thì vô hiệu hóa tất cả các tùy chọn
            }
            next_btn.classList.add("show"); //hiển thị nút next nếu người dùng đã chọn bất kỳ tùy chọn nào
        }
    }
}

function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1; //tăng giá trị thời gian lên 1
        time_line.style.width = time + "px"; //tăng chiều rộng của time_line với đơn vị px theo giá trị thời gian
        if (time > 549) { //nếu giá trị thời gian lớn hơn 549
            clearInterval(counterLine); //xóa bộ đếm thanh tiến trình
        }
    }
}

function queCounter(index) {
    //tạo thẻ span mới và truyền số câu hỏi và tổng số câu hỏi
    let totalQueCounTag = '<span><p>' + index + '</p> trong số <p>' + questions.length + '</p> Câu hỏi</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  //thêm thẻ span mới vào trong bottom_ques_counter
}
