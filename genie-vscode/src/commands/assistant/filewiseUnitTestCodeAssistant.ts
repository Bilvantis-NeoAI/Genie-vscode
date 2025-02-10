import * as vscode from "vscode";
import { postFilewiseUnitTestCodeAssistant } from "../../utils/api/assistantAPI";
import { filewiseUnitTestCodeAssistantWebviewContent } from "../webview/assistant_webview/filewiseUnitTestCodeAssistantWebviewContent";
import { getGitInfo } from "../gitInfo";

export function registerFilewiseUnitTestCodeAssistantCommand(context: vscode.ExtensionContext, authToken: string) {
  const testCases = vscode.commands.registerCommand("extension.assistantFilewiseUnitTestCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      // const selection = editor.selection;
      const text = editor.document.getText();
      console.log("text:", text);
      
      const language = editor.document.languageId;
      
      // Get workspace folder path
      const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
      // Fetch Git information using the getGitInfo function
      const { project_name, branch_name } = await getGitInfo(workspacePath);
      
      try {
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: "Assistant Filewise Unit Test Code",
          cancellable: false,
        };
 
        await vscode.window.withProgress(progressOptions, async () => {
          const response = await postFilewiseUnitTestCodeAssistant(text, language, authToken, project_name, branch_name);
        //   const staticResponse = JSON.stringify({
        //     "testcases": [
        //       {
        //         "description": "Test the addition of elements to the ArrayList",
        //         "testcase": "import static org.junit.Assert.assertEquals;\nimport java.util.ArrayList;\nimport org.junit.Test;\n\npublic class ArrayListTest {\n    @Test\n    public void testAddElement() {\n        ArrayList<String> list = new ArrayList<>();\n        list.add(\"element1\");\n        list.add(\"element2\");\n        assertEquals(2, list.size());\n        assertEquals(\"element1\", list.get(0));\n        assertEquals(\"element2\", list.get(1));\n    }\n}",
        //         "data": [
        //           [
        //             "element1",
        //             "element2"
        //           ],
        //           [
        //             "one",
        //             "two",
        //             "three"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test the removal of elements from the ArrayList",
        //         "testcase": "import static org.junit.Assert.assertEquals;\nimport java.util.ArrayList;\nimport org.junit.Test;\n\npublic class ArrayListTest {\n    @Test\n    public void testRemoveElement() {\n        ArrayList<String> list = new ArrayList<>();\n        list.add(\"element1\");\n        list.add(\"element2\");\n        list.remove(\"element1\");\n        assertEquals(1, list.size());\n        assertEquals(\"element2\", list.get(0));\n    }\n}",
        //         "data": [
        //           [
        //             "element1",
        //             "element2"
        //           ],
        //           [
        //             "a",
        //             "b",
        //             "c"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test accessing an element from the ArrayList by index",
        //         "testcase": "import static org.junit.Assert.assertEquals;\nimport java.util.ArrayList;\nimport org.junit.Test;\n\npublic class ArrayListTest {\n    @Test\n    public void testGetElementByIndex() {\n        ArrayList<String> list = new ArrayList<>();\n        list.add(\"element1\");\n        list.add(\"element2\");\n        assertEquals(\"element2\", list.get(1));\n    }\n}",
        //         "data": [
        //           [
        //             "element1",
        //             "element2"
        //           ],
        //           [
        //             "first",
        //             "second",
        //             "third"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test handling of index out of bounds exception",
        //         "testcase": "import static org.junit.Assert.fail;\nimport java.util.ArrayList;\nimport org.junit.Test;\n\npublic class ArrayListTest {\n    @Test(expected = IndexOutOfBoundsException.class)\n    public void testIndexOutOfBounds() {\n        ArrayList<String> list = new ArrayList<>();\n        list.add(\"element1\");\n        list.get(2); // This should throw an exception\n    }\n}",
        //         "data": [
        //           [
        //             "element1"
        //           ],
        //           [
        //             "onlyOneElement"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test adding a single task to the TaskManager.",
        //         "testcase": "import static org.junit.Assert.*;\nimport org.junit.Before;\nimport org.junit.Test;\nimport java.util.List;\nimport java.util.ArrayList;\n\npublic class TaskManagerTest {\n    private TaskManager manager;\n\n    @Before\n    public void setUp() {\n        manager = new TaskManager();\n    }\n\n    @Test\n    public void testAddTask() {\n        manager.addTask(\"Buy groceries\");\n        List<String> expectedTasks = new ArrayList<>();\n        expectedTasks.add(\"Buy groceries\");\n        assertEquals(expectedTasks, manager.getTasks());\n    }\n}",
        //         "data": [
        //           [
        //             "Buy groceries"
        //           ],
        //           [
        //             "Read a book"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test removing an existing task from the TaskManager.",
        //         "testcase": "@Test\npublic void testRemoveTask() {\n    manager.addTask(\"Buy groceries\");\n    manager.removeTask(\"Buy groceries\");\n    assertFalse(manager.getTasks().contains(\"Buy groceries\"));\n}",
        //         "data": [
        //           [
        //             "Buy groceries"
        //           ],
        //           [
        //             "Read a book"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test removing a task that does not exist in the TaskManager.",
        //         "testcase": "@Test\npublic void testRemoveNonExistentTask() {\n    manager.addTask(\"Buy groceries\");\n    manager.removeTask(\"Read a book\");\n    assertEquals(1, manager.getTasks().size());\n    assertTrue(manager.getTasks().contains(\"Buy groceries\"));\n}",
        //         "data": [
        //           [
        //             "Buy groceries",
        //             "Read a book"
        //           ],
        //           [
        //             "Complete homework",
        //             "Go to the gym"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test listing tasks when TaskManager is empty.",
        //         "testcase": "@Test\npublic void testListTasksEmpty() {\n    assertTrue(manager.getTasks().isEmpty());\n}",
        //         "data": []
        //       },
        //       {
        //         "description": "Test listing tasks when TaskManager has multiple tasks.",
        //         "testcase": "@Test\npublic void testListTasksWithMultipleTasks() {\n    manager.addTask(\"Buy groceries\");\n    manager.addTask(\"Read a book\");\n    List<String> expectedTasks = new ArrayList<>();\n    expectedTasks.add(\"Buy groceries\");\n    expectedTasks.add(\"Read a book\");\n    assertEquals(expectedTasks, manager.getTasks());\n}",
        //         "data": [
        //           [
        //             "Buy groceries",
        //             "Read a book"
        //           ],
        //           [
        //             "Complete homework",
        //             "Go to the gym"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test adding a task to an empty task list",
        //         "testcase": "public void testAddTaskToEmptyList() {\n    TaskManager taskManager = new TaskManager();\n    taskManager.addTask(\"Task 1\");\n    assertEquals(1, taskManager.getTasks().size());\n    assertTrue(taskManager.getTasks().contains(\"Task 1\"));\n}",
        //         "data": [
        //           [
        //             "Task 1"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test adding a duplicate task",
        //         "testcase": "public void testAddDuplicateTask() {\n    TaskManager taskManager = new TaskManager();\n    taskManager.addTask(\"Task 1\");\n    taskManager.addTask(\"Task 1\");\n    assertEquals(2, taskManager.getTasks().size());\n}",
        //         "data": [
        //           [
        //             "Task 1",
        //             "Task 1"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test removing an existing task",
        //         "testcase": "public void testRemoveExistingTask() {\n    TaskManager taskManager = new TaskManager();\n    taskManager.addTask(\"Task 1\");\n    taskManager.removeTask(\"Task 1\");\n    assertEquals(0, taskManager.getTasks().size());\n    assertFalse(taskManager.getTasks().contains(\"Task 1\"));\n}",
        //         "data": [
        //           [
        //             "Task 1"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test removing a non-existing task",
        //         "testcase": "public void testRemoveNonExistingTask() {\n    TaskManager taskManager = new TaskManager();\n    taskManager.addTask(\"Task 1\");\n    taskManager.removeTask(\"Task 2\");\n    assertEquals(1, taskManager.getTasks().size());\n    assertTrue(taskManager.getTasks().contains(\"Task 1\"));\n}",
        //         "data": [
        //           [
        //             "Task 1",
        //             "Task 2"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test listing tasks when tasks are available",
        //         "testcase": "public void testListTasksWithTasksAvailable() {\n    TaskManager taskManager = new TaskManager();\n    taskManager.addTask(\"Task 1\");\n    taskManager.addTask(\"Task 2\");\n    ByteArrayOutputStream outContent = new ByteArrayOutputStream();\n    System.setOut(new PrintStream(outContent));\n    taskManager.listTasks();\n    assertEquals(\"Tasks:\\n- Task 1\\n- Task 2\\n\", outContent.toString());\n    System.setOut(System.out);\n}",
        //         "data": [
        //           [
        //             "Task 1",
        //             "Task 2"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test listing tasks when no tasks are available",
        //         "testcase": "public void testListTasksWithNoTasks() {\n    TaskManager taskManager = new TaskManager();\n    ByteArrayOutputStream outContent = new ByteArrayOutputStream();\n    System.setOut(new PrintStream(outContent));\n    taskManager.listTasks();\n    assertEquals(\"No tasks available.\\n\", outContent.toString());\n    System.setOut(System.out);\n}",
        //         "data": [
        //           []
        //         ]
        //       },
        //       {
        //         "description": "Test adding a single task to the TaskManager",
        //         "testcase": "import org.junit.Test;\nimport static org.junit.Assert.*;\n\npublic class TaskManagerTest {\n\n    @Test\n    public void testAddSingleTask() {\n        TaskManager manager = new TaskManager();\n        manager.addTask(\"Buy groceries\");\n        assertEquals(1, manager.getTaskCount());\n        assertTrue(manager.containsTask(\"Buy groceries\"));\n    }\n}",
        //         "data": [
        //           [
        //             "Buy groceries"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test adding multiple tasks to the TaskManager",
        //         "testcase": "import org.junit.Test;\nimport static org.junit.Assert.*;\n\npublic class TaskManagerTest {\n\n    @Test\n    public void testAddMultipleTasks() {\n        TaskManager manager = new TaskManager();\n        manager.addTask(\"Buy groceries\");\n        manager.addTask(\"Read a book\");\n        assertEquals(2, manager.getTaskCount());\n        assertTrue(manager.containsTask(\"Buy groceries\"));\n        assertTrue(manager.containsTask(\"Read a book\"));\n    }\n}",
        //         "data": [
        //           [
        //             "Buy groceries",
        //             "Read a book"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test removing an existing task from the TaskManager",
        //         "testcase": "import org.junit.Test;\nimport static org.junit.Assert.*;\n\npublic class TaskManagerTest {\n\n    @Test\n    public void testRemoveExistingTask() {\n        TaskManager manager = new TaskManager();\n        manager.addTask(\"Buy groceries\");\n        manager.removeTask(\"Buy groceries\");\n        assertEquals(0, manager.getTaskCount());\n        assertFalse(manager.containsTask(\"Buy groceries\"));\n    }\n}",
        //         "data": [
        //           [
        //             "Buy groceries"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test removing a non-existent task from the TaskManager",
        //         "testcase": "import org.junit.Test;\nimport static org.junit.Assert.*;\n\npublic class TaskManagerTest {\n\n    @Test\n    public void testRemoveNonExistentTask() {\n        TaskManager manager = new TaskManager();\n        manager.addTask(\"Read a book\");\n        manager.removeTask(\"Buy groceries\"); // Task does not exist\n        assertEquals(1, manager.getTaskCount());\n        assertTrue(manager.containsTask(\"Read a book\"));\n    }\n}",
        //         "data": [
        //           [
        //             "Read a book",
        //             "Buy groceries"
        //           ]
        //         ]
        //       },
        //       {
        //         "description": "Test listing tasks in the TaskManager",
        //         "testcase": "import org.junit.Test;\nimport static org.junit.Assert.*;\nimport java.util.List;\n\npublic class TaskManagerTest {\n\n    @Test\n    public void testListTasks() {\n        TaskManager manager = new TaskManager();\n        manager.addTask(\"Buy groceries\");\n        manager.addTask(\"Read a book\");\n        List<String> tasks = manager.listTasks();\n        assertEquals(2, tasks.size());\n        assertTrue(tasks.contains(\"Buy groceries\"));\n        assertTrue(tasks.contains(\"Read a book\"));\n    }\n}",
        //         "data": [
        //           [
        //             "Buy groceries",
        //             "Read a book"
        //           ]
        //         ]
        //       }
        //     ]
        //   });
          
          const formattedContent = JSON.stringify(response, null, 2);
        console.log("formatted content:", formattedContent);
        
          const panel = vscode.window.createWebviewPanel("filewiseUnitTestCodeAssistant", "Filewise Unit Test Code Assistant", vscode.ViewColumn.Beside, {
            enableScripts: true,
          });
 
          panel.webview.html = filewiseUnitTestCodeAssistantWebviewContent(formattedContent, "Filewise Unit Test Code Assistant");
 
          // Listen for messages from the webview
          panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
        //       case 'accept':
        //         // Replace the code in the editor with the commented code
        //         editor.edit(editBuilder => {
        //           editBuilder.replace(selection, response.documentationAdded);
        //         });
        //         panel.dispose(); // Close the webview after accepting
        //         break;
              case 'reject':
                // Just close the webview without making any changes
                panel.dispose();
                break;
            }
          }
        );
        });
 
      } catch (error:any) {
        const errorMessage = error.message || "An unknown error occurred.";
        vscode.window.showErrorMessage(`Error Test Cases Review: ${errorMessage}`);
      }
    }
  });
 
  context.subscriptions.push(testCases);
}
 
 