import React, { useState, useEffect } from 'react';
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

// components
import Header from './components/Header';
import CardHeader from './components/CardHeader';
import CardBody from './components/CardBody';
import CardFooter from './components/CardFooter';

// utils
import { createNiceDateForCardHeader } from './utils/TimeUtils.js';

// images
import left from './images/left.png';
import leftSlide from './images/left-slide.png';
import right from './images/right.png';
import rightSlide from './images/right-slide.png';

// css
import './App.css';
import './styles/style.css';

const namespaceGlobal = {
    lastSelectedDay: null,
    lastTimePicked: null,
    notesDublicate: null,
    headInfoDublicates: null
};

function App() {
    /*
     *
     *
     * global namespace variables
     */
    const [selectedDate, setSelectedDate] = useState(new Date());

    const customSetNotes = (notes) => {
        setNotes(notes);
        namespaceGlobal.notesDublicate = notes;
    }

    const customGetNotes = () => {
        return {...namespaceGlobal.notesDublicate};
    }

    const customSetHeadInfo = (info) => {
        setHeadInfo(info);
        namespaceGlobal.headInfoDublicates = info;
    }

    const customGetHeadInfo = () => {
        return {...namespaceGlobal.headInfoDublicates};
    }

    // react hook to fire methods or set values before the rendering of the component
    useEffect(() => {
        const init = () => {
            document.querySelectorAll('.add-note').forEach(btn => {
                btn.addEventListener('click', () => addNote(btn));
            });

            document.querySelectorAll('.submit-note').forEach(btn => {
                btn.addEventListener('click', () => submitNote(namespaceGlobal.lastSelectedDay));
            });

            document.querySelectorAll('.cancel-note').forEach(btn => {
                btn.addEventListener('click', moveEditorRight);
            });


            namespaceGlobal.notesDublicate = notes;
            namespaceGlobal.headInfoDublicates = headInfo;

            initDates();
        };
        init();
        const getData = async () => {
            let storageNotes = await window.localStorage.getItem('student-notes');
            let storageHeadInfo = await window.localStorage.getItem('student-headInfo');
            let storageKeys = await window.localStorage.getItem('student-notes-keys');

            if (storageNotes !== null && storageHeadInfo !== null) {
                storageNotes = JSON.parse(storageNotes);
                storageHeadInfo = JSON.parse(storageHeadInfo);
                storageKeys = JSON.parse(storageKeys);

                customSetHeadInfo(storageHeadInfo);
                customSetNotes(storageNotes);
                setNotesKeys(storageKeys);
            }
        };

        getData();
    }, []);

    // react hook for state management
    const [notes, setNotes] = useState({
        note1: [
            {
                badgeType: 'badge-warning',
                badgeContent: 'Deadline',
                noteContent: 'Calculus homework',
            },
            {
                badgeType: 'badge-light',
                badgeContent: '16-30',
                noteContent: 'Meet Alice at Hard Rock Cafe',
            },
        ],
        note2: [
            {
                badgeType: 'badge-warning',
                badgeContent: 'Deadline',
                noteContent: 'Java test on Maven',
            },
            {
                badgeType: 'badge-light',
                badgeContent: '15-00',
                noteContent: 'Gym',
            },
            {
                badgeType: 'badge-info',
                badgeContent: 'Links or references',
                noteContent: "The hitchhiker's guide to the galaxy",
            },
        ],
        note3: [
            {
                badgeType: 'badge-warning',
                badgeContent: 'Deadline',
                noteContent: 'Economics homework',
            },
            {
                badgeType: 'badge-light',
                badgeContent: '18-00',
                noteContent: 'Call my team to discuss project',
            },
            {
                badgeType: 'badge-info',
                badgeContent: 'Links or references',
                noteContent: 'Introduction to Algorithms, CLRS',
            },
        ],
    });
    const [headInfo, setHeadInfo] = useState({
        note1: {
            monthDay: '7th October',
            weekDay: 'Wednesday',
            relativeDay: 'Yesterday',
            badgeType: 'badge-danger',
        },
        note2: {
            monthDay: '8th October',
            weekDay: 'Thursday',
            relativeDay: 'Today',
            badgeType: 'badge-warning',
        },
        note3: {
            monthDay: '9th October',
            weekDay: 'Friday',
            relativeDay: 'Tomorrow',
            badgeType: 'badge-primary',
        },
    });
    const [notesKeys, setNotesKeys] = useState(Object.keys(notes));
    const [middleCard, setMiddleCard] = useState(2);


    const addNote = btn => {
        let card = btn.closest('.card');
        namespaceGlobal.lastSelectedDay = card.querySelector('h4').innerHTML;
        moveEditorLeft();
    };

    /*
     *
     *
     * radio button for add note
     */
    const createBadgeContentFromRadio = () => {
        let [deadline, link, time] = ['deadline', 'link', 'time'].map(num =>
            document.querySelector('#badge-' + num)
        );

        if (deadline.checked) {
            return ['Deadline', 'badge-warning'];
        } else if (link.checked) {
            return ['Link or reference', 'badge-info'];
        } else {
            return [formatDateToHHMM(selectedDate), 'badge-light'];
        }
    };

    /**
     *
     * storing all the notes data in the browser local storage
     */
    const storingDataInLocalStorage = () => {
        let storage = window.localStorage;

        if (storage.getItem('student-notes-keys') !== null) {
            storage.removeItem('student-notes-keys');
            storage.removeItem('student-notes');
            storage.removeItem('student-headInfo');
        }

        storage.setItem('student-notes-keys', JSON.stringify(notesKeys));
        storage.setItem('student-notes', JSON.stringify(notes));
        storage.setItem('student-headInfo', JSON.stringify(headInfo));
    };

    /*
     *
     *
     * submitting the note so it can be renderered on the screen
     */
    const submitNote = lastSelectedDay => {
        let noteContent = document.querySelector('#note-content').value;

        let [text, badge] = createBadgeContentFromRadio();

        // rendering the data on screen

        let cards = document.querySelectorAll('.flex-container .card');
        let chosen;
        for (let card of cards) {
            let monthDay = card.querySelector('h4').innerHTML;

            console.log(monthDay, lastSelectedDay);
            if (monthDay === lastSelectedDay) {
                chosen = card;
                break;
            }
        }

        // updating state

        const noteInfo = {
            badgeType: `${badge}`,
            badgeContent: `${text}`,
            noteContent: `${noteContent}`,
        };

        const card = `note${chosen.id}`;
        const temp = customGetNotes();
        console.log('id ' + card); // note4
        console.log(temp); // {note1: [], note2: [], note3: [], note4: []}
        console.log(temp[card]); // undefined
        console.log(Array.isArray(temp[card]))
        temp[card].push(noteInfo);
        customSetNotes(temp);

        // rendering the data on screen again

        storingDataInLocalStorage();

        moveEditorRight();

        rehangDeleters();
    };

    const deleteHandler = (cardId, note) => {
        let cardName = 'note' + cardId;
        let tmp = {...customGetNotes()}; // redundant ??
        let card = tmp[cardName];
        for (let i = 0; i < card.length; i++) {
            let curNote = card[i];
            // console.log(card, cardId, cardName, curNote);
            console.log('supposed to delete')
            console.log(note);
            console.log('meeting');
            console.log(curNote)
            console.log(note, curNote);
            if (curNote.badgeType == note.badgeType &&
                curNote.badgeContent == note.badgeContent &&
                curNote.noteContent == note.noteContent) {
                console.log('splicing');
               card.splice(i, 1);
                break;
            }
        }
        customSetNotes(tmp);
    }

    const rehangDeleters = () => {
        let cards = document.querySelectorAll('.flex-container .card');
        let cardId = 0;
        cards.forEach(card => {
            cardId++;
            const localCardId = cardId;
            let btnId = 0;
            let btns = card.querySelectorAll('.delete-button');
            btns.forEach(btn => {
                btnId++;
                const localBtnId = btnId;
                const supposed = customGetNotes()['note' + localCardId][localBtnId - 1];
                btn.addEventListener('click', () => deleteHandler(localCardId, supposed));
            });
        });
    }

    const delimiterAfterHeader = 'header-delimiter';

    /*
     *
     *
     * moving add note editor to the left of the screen
     */
    const moveEditorLeft = () => {
        let editor = document.querySelector('.note-editor');
        let offset =
            document.querySelector('.jumbotron').offsetHeight +
            document.querySelector('.' + delimiterAfterHeader).offsetHeight;

        editor.style.top = offset + 'px';
        editor.style.left = '0';
    };

    /*
     *
     *
     * moving add note editor to the right of the screen
     */
    const moveEditorRight = () => {
        let editor = document.querySelector('.note-editor');
        editor.style.left = '100vw';
    };

    const handleTimeChange = date => {
        setSelectedDate(date);
        namespaceGlobal.lastTimePicked = date;
    };

    // remove key from notes keys state

    /*
     *
     *
     * format time
     */
    const formatDateToHHMM = date => {
        let h = date.getHours();
        let m = date.getMinutes();
        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        return `${h}:${m}`;
    };

    /*
     *
     *
     * initializing dates for the cards
     */
    const initDates = () => {
        let msInDay = 24 * 60 * 60 * 1000;
        let cardTime = Date.now() - msInDay;

        let tmp = { ...customGetHeadInfo() };
        for (let note of notesKeys) {
            let cardDate = new Date(cardTime);
            createNiceDateForCardHeader(tmp[note], cardDate);
            cardTime += msInDay;
        }
        customSetHeadInfo(tmp);
    };

    /**
     *
     * create new card on the  screen
     */
    const createCard = async middle => {
        const numOfNotes = notesKeys.length;
        const noteName = `note${numOfNotes + 1}`;

        let newNoteHead = {
            [noteName]: {
                monthDay: '7th October',
                weekDay: 'Wednesday',
                relativeDay: 'Later',
                badgeType: 'badge-primary',
            },
        };

        const msInDay = 24 * 60 * 60 * 1000;
        const timestampForNewCard = msInDay * (middle - 2) + Date.now();
        createNiceDateForCardHeader(newNoteHead[noteName], new Date(timestampForNewCard));

        const newNote = {
            [noteName]: [],
        };

        const tempNoteHead = { ...customGetHeadInfo(), ...newNoteHead };
        const realNotes = customGetNotes();
        const tempNote = { ...realNotes, ...newNote };
        const tempKey = [...notesKeys, noteName];
        customSetNotes(tempNote);
        customSetHeadInfo(tempNoteHead);
        setNotesKeys(tempKey);
    };

    /*
     *
     *
     * move to the previous card to the left
     */
    const prevCard = () => {
        let middle = middleCard;
        middle--;
        setMiddleCard(middle);
        const cardId = document.getElementById('days-container');
        cardId.scrollLeft -= 420;
    };

    /*
     *
     *
     * move to the next card to the right
     */
    const nextCard = async () => {
        let middle = middleCard;
        middle++;
        setMiddleCard(middle);

        let cards = notesKeys.length;
        middle++;
        console.log(middle);
        if (middle <= cards) {
        } else {
            const width = document.getElementById('changeStyle').offsetWidth;
            const newWidth = width + 380 + 'px';
            document.getElementById('changeStyle').style.width = newWidth;
            await createCard(middle);
            const addButtons = document.querySelectorAll('.add-note');
            const lastBtn = addButtons.item(addButtons.length - 1);
            lastBtn.addEventListener('click', () => addNote(lastBtn));
        }

        const cardId = document.getElementById('days-container');
        cardId.scrollLeft += 420;
    };

    /*
     *
     *
     * move to the previous slide to the left
     */
    const prevSlide = () => {
        let middle = middleCard;
        middle -= 2;
        setMiddleCard(middle);
        const cardId = document.getElementById('days-container');
        cardId.scrollLeft -= 1100;
    };

    /*
     *
     *
     * move to the next slide to the right
     */
    const nextSlide = () => {
        const cardId = document.getElementById('days-container');
        cardId.scrollLeft += 1100;
    };

    return (
        <div id='#bootstrap-overrides'>
            <Header title='Notelify' version='v0.1.1' />
            <div className={delimiterAfterHeader}></div>
            <div className='days-button'>
                <img src={left} alt='left' onClick={prevCard} className='prev-btn' />
                <img src={leftSlide} alt='left-slide' onClick={prevSlide} className='prev-btn' />
            </div>
            <div className='flex-wrapper'>
                <div className='left-white-gradient'></div>
                <div className='wrapper-cards' id='days-container'>
                    <div className='flex-container' id='changeStyle'>
                        {notesKeys.map(note => (
                            <div className='card flex-card slide' id={notesKeys.indexOf(note) + 1}>
                                <CardHeader headInfo={headInfo[note]} />
                                <CardBody notes={notes[note]} />
                                <CardFooter />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='right-white-gradient'></div>
            </div>
            <div className='days-button'>
                <img src={right} alt='right' onClick={nextCard} className='next-btn' />
                <img src={rightSlide} alt='right slide' onClick={nextSlide} className='next-btn' />
            </div>
            <div className='note-editor'>
                <div className='card note-editor-card'>
                    <div className='card-body'>
                        <h5>Note or Event</h5>
                        <div className='form-group note-content-input'>
                            <input
                                id='note-content'
                                className='form-control'
                                placeholder='Write down anything important for you'
                            />
                        </div>
                        <h5>Choose label for your note</h5>

                        <div className='form-check note-badge-line'>
                            <input
                                className='form-check-input'
                                type='radio'
                                name='badge-radio'
                                id='badge-deadline'
                                defaultChecked
                            ></input>
                            <label
                                className='form-check-label badge-radio'
                                htmlFor='badge-deadline'
                            >
                                <span className='badge badge-pill badge-warning'>Deadline</span>
                            </label>
                        </div>

                        <div className='form-check note-badge-line'>
                            <input
                                className='form-check-input'
                                type='radio'
                                name='badge-radio'
                                id='badge-link'
                            ></input>
                            <label className='form-check-label badge-radio' htmlFor='badge-link'>
                                <span className='badge badge-pill badge-info'>
                                    Link or reference
                                </span>
                            </label>
                        </div>

                        <div className='form-check note-badge-line'>
                            <input
                                className='form-check-input'
                                type='radio'
                                name='badge-radio'
                                id='badge-time'
                            ></input>
                            <label className='form-check-label badge-radio' htmlFor='badge-time'>
                                <span className='badge badge-pill badge-light'>Time</span>
                            </label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker value={selectedDate} onChange={handleTimeChange} />
                            </MuiPickersUtilsProvider>
                        </div>

                        <button className='submit-note btn btn-primary'>Add</button>
                        <button className='cancel-note btn'>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
