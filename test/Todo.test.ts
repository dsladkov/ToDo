import {time, loadFixture, hre, ethers, expect, anyValue, SignerWithAddress} from "./setup";
import  {ToDoEngine} from "../typechain-types";

describe("Todo", function(){
  async function deploy() {
    const [owner, other] = await ethers.getSigners();

    const ToDoEngine = await ethers.getContractFactory("ToDoEngine");
    const todoEngine = await ToDoEngine.deploy();
    await todoEngine.waitForDeployment()

    return {todoEngine, owner, other};
  }
  it("should allow to do todo", async function () {
    const {todoEngine, owner, other} = await loadFixture(deploy);

    const title = "TestTitle";
    const description = "TestDescription";
    const txAddTodo = await todoEngine.addTodo(title, description);
    const txReceipt = await txAddTodo.wait();
    
    const tuple = await todoEngine.getTodo(0);
    expect(tuple[0]).eq(title);
    expect(tuple[1]).eq(description);
    expect(tuple[2]).to.be.false;

  });
  it("should allow to change todo title by owner", async function () {
    const {todoEngine, owner, other} = await loadFixture(deploy);

    const title = "TestTitle";
    const description = "TestDescription";
    const txAddTodo = await todoEngine.addTodo(title, description);
    const txReceipt = await txAddTodo.wait();
    
    const newTitle = "NewTitle";
    const txchangeStatusTodo = await todoEngine.connect(owner).changeTodoTitle(newTitle, 0);
    const toDo = await todoEngine.getTodo(0);
    expect(toDo[0]).eq(newTitle);

  });
  it("should allow to change todo status by owner", async function () {
    const {todoEngine, owner, other} = await loadFixture(deploy);

    const title = "TestTitle";
    const description = "TestDescription";
    const txAddTodo = await todoEngine.addTodo(title, description);
    const txReceipt = await txAddTodo.wait();
    
    const txchangeStatusTodo = await todoEngine.connect(owner).changeTodoStatus(0);
    const toDo = await todoEngine.getTodo(0);
    expect(toDo[2]).eq(true);

  });
  it("shouldn't possible to connect to get todo if not an owner", async function() {
    const {todoEngine, owner, other} = await loadFixture(deploy);

    await expect(todoEngine.connect(other).getTodo(0)).revertedWithCustomError(todoEngine, "NotAnOwner");
  });
  it("shouldn't possible to connect to add if not an owner", async function() {
    const {todoEngine, owner, other} = await loadFixture(deploy);

    await expect(todoEngine.connect(other).addTodo("DummyTitle", "DymmyDescription")).revertedWithCustomError(todoEngine, "NotAnOwner");
  });

  it("shouldn't possible to connect to change todo title if not an owner", async function() {
    const {todoEngine, owner, other} = await loadFixture(deploy);

    await expect(todoEngine.connect(other).changeTodoTitle("DummyTitle", 0)).revertedWithCustomError(todoEngine, "NotAnOwner");
  });
  it("shouldn't possible to connect to change todo status completed if not an owner", async function() {
    const {todoEngine, owner, other} = await loadFixture(deploy);

    await expect(todoEngine.connect(other).changeTodoStatus(0)).revertedWithCustomError(todoEngine, "NotAnOwner");
  });
})