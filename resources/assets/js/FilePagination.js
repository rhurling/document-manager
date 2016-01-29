import React from 'react';

class FilePagination extends React.Component {

    static propTypes = {
        currentPage: React.PropTypes.number.isRequired,
        lastPage: React.PropTypes.number.isRequired,
        onPageChange: React.PropTypes.func.isRequired
    };

    constructor() {
        super();

        this.prevPageClicked = this.prevPageClicked.bind(this);
        this.nextPageClicked = this.nextPageClicked.bind(this);
        this.pageClicked = this.pageClicked.bind(this);

        this.renderPrevious = this.renderPrevious.bind(this);
        this.renderNext = this.renderNext.bind(this);
        this.renderDots = this.renderDots.bind(this);
        this.renderNumber = this.renderNumber.bind(this);
        this.renderRange = this.renderRange.bind(this);
        this.renderStart = this.renderStart.bind(this);
        this.renderFinish = this.renderFinish.bind(this);
        this.renderAdjacentRange = this.renderAdjacentRange.bind(this);
        this.renderSlider = this.renderSlider.bind(this);
    }

    prevPageClicked(evt) {
        evt.preventDefault();

        if (this.props.currentPage > 1) {
            this.props.onPageChange(Number(this.props.currentPage) - 1);
        }
    }

    nextPageClicked(evt) {
        evt.preventDefault();

        if (this.props.currentPage < this.props.lastPage) {
            this.props.onPageChange(Number(this.props.currentPage) + 1);
        }
    }

    pageClicked(evt) {
        evt.preventDefault();
        var pageNum = parseInt(evt.target.text);

        if (this.props.currentPage != pageNum) {
            this.props.onPageChange(Number(pageNum));
        }
    }

    renderPrevious() {
        var classStr = this.props.currentPage <= 1 ? 'disabled' : '';
        return <li key="prev" className={classStr}>
            <a href="#" rel="prev" onClick={this.prevPageClicked}>«</a>
        </li>
    }

    renderNext() {
        var classStr = this.props.currentPage >= this.props.lastPage ? 'disabled' : '';
        return <li key="next" className={classStr}>
            <a href="#" rel="next" onClick={this.nextPageClicked}>»</a>
        </li>
    }

    renderDots(key) {
        return <li key={key} className="disabled"><span>...</span></li>;
    }

    renderNumber(num) {
        var classStr = this.props.currentPage == num ? 'active' : '';
        return (
            <li key={num} className={classStr}>
                <a href="#" onClick={this.pageClicked}>{num}</a>
            </li>
        );
    }

    renderRange(firstNum, lastNum) {
        var pages = [];
        for (var i = firstNum; i <= lastNum; i++) {
            pages.push(this.renderNumber(i));
        }
        return pages;
    }

    renderStart() {
        var pages = this.renderRange(1, 2);
        pages.push(this.renderDots('dots-start'));

        return pages;
    }

    renderFinish() {
        var pages = this.renderRange(this.props.lastPage - 1, this.props.lastPage);
        pages.unshift(this.renderDots('dots-finish'));

        return pages;
    }

    renderAdjacentRange() {
        return this.renderRange(this.props.currentPage - 2, this.props.currentPage + 2);
    }

    renderSlider() {
        var sliderNum = 6;
        var buttons = [];

        if (this.props.currentPage <= sliderNum) {
            buttons = buttons.concat(this.renderRange(1, sliderNum + 2));
            buttons = buttons.concat(this.renderFinish());
        }

        else if (this.props.currentPage >= this.props.lastPage - sliderNum) {
            buttons = buttons.concat(this.renderStart());
            buttons = buttons.concat(this.renderRange(this.props.lastPage - sliderNum, this.props.lastPage));
        }

        else {
            buttons = buttons.concat(this.renderStart());
            buttons = buttons.concat(this.renderAdjacentRange());
            buttons = buttons.concat(this.renderFinish());
        }

        return buttons;
    }

    render() {
        if (this.props.lastPage === 1) {
            return <div></div>
        }

        var buttons = [];

        buttons.push(this.renderPrevious());

        if (this.props.lastPage <= 13) {
            buttons = buttons.concat(this.renderRange(1, this.props.lastPage));
        }
        else {
            buttons = buttons.concat(this.renderSlider());
        }

        buttons.push(this.renderNext());

        return <div className="text-center">
            <ul className="pagination">
                {buttons}
            </ul>
        </div>
    }

}

export default FilePagination