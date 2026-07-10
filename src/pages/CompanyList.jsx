import React from "react";
import Table from "../components/Table";
import Section from "../components/Section";
import Search from "../components/Search";
import Dropdown from "../components/Dropdown";
import GlobalNav from "../components/GlobalNav";

function CompanyList() {

  const handleSearch = (keyword) => {
    console.log("검색어:", keyword);
  }

  const sectionRight = (
    <form className="search_wrap_parent flex">
      <Search size={'medium'} onSubmit={handleSearch}></Search>
      <Dropdown size={'medium'} ></Dropdown>
    </form>
  );
  return (
    <>
      <div className="content_wrap">
        <Section title={'전체 스타트업 목록'} sh_right={sectionRight}>

          {/* section */}
          <Table></Table>
        </Section>

      </div>
      {/* pagnation 위치는 content_wrap안이 좋을지 밖이 좋을지 고려 */}
      <p className="text">test</p>
    </>
  );
}

export default CompanyList;