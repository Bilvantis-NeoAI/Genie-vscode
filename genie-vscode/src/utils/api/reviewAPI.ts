import axios from "axios";
import { getBaseApi  } from "../../auth/config";
import { getAuthHeaders } from "../../auth/apiHeaders";

export async function postReviewCode(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
    const response = await axios.post(
      `${getBaseApi()}/review/code`,
      { code, language, project_name, branch_name },
      {
        headers: getAuthHeaders(authToken),
        signal: options?.signal,
      }
    );
    
    return response.data; //.reviewComments;
  }


export async function postPerformanceReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/performance`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postSecurityReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/security`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postSyntaxReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/syntax`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postOverallReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/overall`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postOwaspReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/owasp`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postTechDebtReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/tech-debt`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postOrgStdReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/org-std-review`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postCkReview(code: string, language: string, authToken: string, project_name: any, branch_name: string, options?: { signal?: AbortSignal }): Promise<any> {
  const response = await axios.post(
    `${getBaseApi()}/review/CK-review`,
    { code, language, project_name, branch_name },
    {
      headers: getAuthHeaders(authToken),
      signal: options?.signal,
    }
  );
  return response.data;
}

export async function postAllReview(
  code: string,
  language: string,
  authToken: string,
  project_name: any,
  branch_name: string,
  options?: { signal?: AbortSignal } // Accept optional abort signal
): Promise<any> {
  // const response = await axios.post(
  //   `${getBaseApi()}/review/review`,
  //   { code, language, project_name, branch_name },
  //   {
  //     headers: getAuthHeaders(authToken),
  //     signal: options?.signal, // Pass the signal to Axios
  //   }
  // );
  const mockresponse = {  "quality": "poor",  "remarks": "The code exhibits a significant number of issues related to syntax, code hygiene, complexity, and general programming practices. It demonstrates poor coding structure, improper naming conventions, excessive cyclomatic complexity, lack of documentation, magic numbers, memory leaks, inefficient algorithms, and globally scoped variables and functions.\nThe code is riddled with multiple performance issues that significantly degrade its efficiency and scalability.\nThe code exhibits multiple critical security vulnerabilities, failing to comply with basic OWASP standards. Hardcoded credentials, outdated hashing algorithms, and numerous unchecked input usage present significant security risks. Immediate remediation is essential before any production deployment.\nThe code contains multiple critical syntactical errors, such as missing colons and incorrect class definitions, making it invalid and unable to execute.\nThe code does not follow the organizational standards properly, highlighting numerous issues across all categories including naming conventions, documentation, and error handling.\nThe feature implementation suffers from several design quality issues based on CK metrics, including poor cohesion, excessive complexity, high coupling, deep inheritance trees, and high response for class values. These issues negatively impact maintainability and comprehension.\nThe code snippet contains numerous critical security and compliance violations across multiple organizational policy areas. The issues pertain to Cloud SQL security, load balancer configuration, service account management, SSL and certificate handling, secret management, and Cloud Run security. These violations expose the system to significant risk in terms of data breaches, unauthorized access, and potential regulatory non-compliance.",  "overallSeverity": "critical",  "issues": {    "Quality": [      {        "identification": "class BadSyntaxClass\n    def __init__(self)  # Missing colon",        "explanation": "This misses a colon after the class definition and method header, which makes the code break.",        "fix": "class BadSyntaxClass:\n    def __init__(self):\n        self.value = 1",        "score": 8,        "severity": "critical"       },      {        "identification": "def __init__(self):\n        self.api_key = \"sk-1234567890abcdef\"",        "explanation": "API keys and secrets are hardcoded which is a poor practice for maintainability and security reasons.",        "fix": "def __init__(self, api_key):\n        self.api_key = api_key",        "score": 6,        "severity": "major"       },      {        "identification": "for j in range(len(self.data)):\n                if self.data[i] == target:",        "explanation": "This uses an O(n²) complexity approach for a search operation where a linear search would suffice.",        "fix": "def inefficient_search(self, target):\n        return [i for i, value in enumerate(self.data) if value == target]",        "score": 7,        "severity": "major"       },      {        "identification": "result += str(i) + \",\"",        "explanation": "String concatenation in loops leads to performance issues. It should be done using `join()`.",        "fix": "result = \",\".join(str(i) for i in range(10000))",        "score": 5,        "severity": "major"       },      {        "identification": "def method1(self):\n        result = self.x + self.y\n        result = result * 2\n        result = result + self.z\n        return result\n\n    def method2(self):  # Exact duplicate of method1",        "explanation": "Methods method1 and method2 are identical, causing redundant code.",        "fix": "def method1(self):\n        return (self.x + self.y) * 2 + self.z",        "score": 4,        "severity": "minor"       },      {        "identification": "class a:  # Poor class name",        "explanation": "Single-letter class names do not convey any meaningful information about the purpose of the class.",        "fix": "class ArithmeticOperations:",        "score": 3,        "severity": "minor"       },      {        "identification": "def global_function_without_class():",        "explanation": "Global functions without error handling and use of global variables make the code hard to maintain.",        "fix": "def fetch_data(api_endpoint):\n    try:\n        response = requests.get(api_endpoint)\n        response.raise_for_status()\n        return response.json()\n    except requests.RequestException as e:\n        print(f\"Request error: {e}\")\n        return None",        "score": 7,        "severity": "major"       },      {        "identification": "global_config = {\n    \"debug\": True,\n    \"api_endpoint\": \"http://insecure-api.com\",\n    \"timeout\": 30000 # Magic number",        "explanation": "Magic numbers reduce readability and should be defined as constants.",        "fix": "TIMEOUT = 30000\nglobal_config = {\n    \"debug\": True,\n    \"api_endpoint\": \"http://insecure-api.com\",\n    \"timeout\": TIMEOUT",        "score": 5,        "severity": "minor"       },      {        "identification": "result = data / 0  # Will cause ZeroDivisionError",        "explanation": "Division by zero is not handled, leading to potential runtime errors.",        "fix": "try:\n    result = data / divisor\nexcept ZeroDivisionError:\n    print(\"Error: Division by zero\")\n    result = None",        "score": 8,        "severity": "critical"       }    ],    "Performance": [      {        "identification": "def inefficient_search(self, target): ...",        "explanation": "The search algorithm is using a double nested loop, resulting in an O(n²) time complexity, even though an O(n) solution is achievable.",        "fix": "def efficient_search(self, target): return [i for i, value in enumerate(self.data) if value == target]",        "score": 9,        "severity": "critical"       },      {        "identification": "def bad_string_concat(self): ...",        "explanation": "String concatenation in a loop is inefficient because strings are immutable in Python, leading to creating many unnecessary copies.",        "fix": "def optimized_string_concat(self): return ','.join(str(i) for i in range(10000))",        "score": 8,        "severity": "major"       },      {        "identification": "def bad_file_operations(self): ...",        "explanation": "The file operations are inefficient due to opening and closing files in a loop without batching, which is costly for both CPU and I/O.",        "fix": "def better_file_operations(self): with open('aggregate.txt', 'w') as f: for i in range(1000): f.write(f'data {i}\\n')",        "score": 8,        "severity": "major"       },      {        "identification": "list(range(1000000))",        "explanation": "Creating a massive list at once can cause unnecessary memory allocation and potential heap pressure.",        "fix": "self.data = [] # Use when necessary with appropriate logic",        "score": 6,        "severity": "major"       },      {        "identification": "def create_circular_reference(self): ...",        "explanation": "Circular references can lead to memory leaks as garbage collection is less effective.",        "fix": "for node in nodes: node.parent = None",        "score": 7,        "severity": "major"       }    ],    "Security": [      {        "identification": "self.api_key = 'sk-1234567890abcdef'",        "explanation": "Hardcoded API keys can be exposed if the code is shared and should be securely stored using environment variables or a secrets management service.",        "fix": "import os\n\nself.api_key = os.getenv('API_KEY')",        "score": 10,        "severity": "critical"       },      {        "identification": "def unsafe_database_query(self, user_id):\n    query = f'SELECT * FROM users WHERE id = {user_id}'",        "explanation": "This code allows SQL injection due to direct string interpolation of user input, potentially exposing sensitive data or altering the database.",        "fix": "query = 'SELECT * FROM users WHERE id = %s'",        "score": 10,        "severity": "critical"       },      {        "identification": "def unsafe_command_execution(self, filename):\n    command = f'cat {filename}'",        "explanation": "Using user input directly in a shell command enables command injection, which an attacker could exploit to execute arbitrary commands.",        "fix": "command = ['cat', filename]\nresult = subprocess.run(command, capture_output=True)",        "score": 9,        "severity": "critical"       },      {        "identification": "return hashlib.md5(data.encode()).hexdigest()",        "explanation": "MD5 is a weak hashing algorithm as it is vulnerable to collision attacks and should not be used for hashing sensitive information.",        "fix": "import hashlib\n\nreturn hashlib.sha256(data.encode()).hexdigest()",        "score": 8,        "severity": "major"       },      {        "identification": "with open(filepath, 'r') as f:\n    return f.read()",        "explanation": "Lack of proper validation on file paths can lead to path traversal attacks allowing attackers to access unauthorized files.",        "fix": "import os\n\nsafe_path = os.path.normpath(filepath)\nwith open(safe_path, 'r') as f:\n    return f.read()",        "score": 8,        "severity": "major"       },      {        "identification": "connection = mysql.connector.connect(\n            ..., ssl_disabled=True)",        "explanation": "Disabling SSL for database connections can expose the data to network sniffing attacks and should be enabled to protect data in transit.",        "fix": "connection = mysql.connector.connect(\n            ..., ssl_disabled=False)",        "score": 9,        "severity": "critical"       },      {        "identification": "response = requests.get(global_config[\"api_endpoint\"])",        "explanation": "Using HTTP exposes the communication to interception and modification by attackers, promoting the use of HTTPS to ensure data confidentiality and integrity.",        "fix": "import requests\n\nresponse = requests.get(\"https://secure-api.com\")",        "score": 9,        "severity": "critical"       }    ],    "Syntax": [      {        "identification": "class BadSyntaxClass",        "explanation": "Class declaration is missing a colon at the end.",        "fix": "class BadSyntaxClass:",        "score": 10,        "severity": "critical"       },      {        "identification": "def __init__(self)  # Missing colon",        "explanation": "Method definition is missing a colon at the end, making it syntactically incorrect.",        "fix": "def __init__(self):",        "score": 10,        "severity": "critical"       },      {        "identification": "def get_value(self)",        "explanation": "Method definition is missing a colon at the end, which is required to define the function body.",        "fix": "def get_value(self):",        "score": 10,        "severity": "critical"       },      {        "identification": "self.x=1",        "explanation": "Missing spaces around the assignment operator, making the code less readable.",        "fix": "self.x = 1",        "score": 2,        "severity": "cosmetic"       },      {        "identification": "ssl_disabled=True  # SSL disabled",        "explanation": "The parameter should be 'ssl_disabled' if that's the intention, but here it's part of the logic issue rather than syntax. However, if incorrect, check its context.",        "fix": "ssl_disabled=False",        "score": 1,        "severity": "cosmetic"       }    ],    "Organization Standards": [      {        "identification": "class BadSyntaxClass\n    def __init__(self)",        "explanation": "The class has bad syntactic structure with missing keyword for class definition and improper method definition.",        "fix": "class BadSyntaxClass:\n    def __init__(self):",        "severity": "critical"       },      {        "identification": "def complex_method(self,a,b,c,d,e,f,g,h,i,j):",        "explanation": "This method has too many parameters; it is extremely complex and violates single responsibility.",        "fix": "def complex_method(self, *args):",        "severity": "major"       },      {        "identification": "result += str(i) + \",\"",        "explanation": "String concatenation in a loop is inefficient; should use join instead.",        "fix": "result = \",\".join(map(str, range(10000)))",        "severity": "major"       },      {        "identification": "self.api_key = \"sk-1234567890abcdef\"",        "explanation": "Hardcoded API keys are a major security risk.",        "fix": "self.api_key = os.getenv('API_KEY')",        "severity": "critical"       },      {        "identification": "def process_data(self, data):",        "explanation": "No error handling for division by zero and no docstring.",        "fix": "def process_data(self, data):\n    try:\n        result = data / 1 \n    except ZeroDivisionError:\n        result = float('inf')\n    return result",        "severity": "critical"       },      {        "identification": "global_secret = \"global_api_key_123\"",        "explanation": "Using global variables is a bad practice as it can cause unexpected behaviors in larger applications.",        "fix": "def main():\n    global_secret = os.getenv('GLOBAL_SECRET')",        "severity": "major"       },      {        "identification": "syntax_obj.get_value()",        "explanation": "This method is called without handling the returned value which can lead to unexpected errors.",        "fix": "value = syntax_obj.get_value()",        "severity": "major"       },      {        "identification": "def main():\n    ...\nmain()",        "explanation": "No use of `if __name__ == \"__main__\":` to ensure code is run at the top-level scope.",        "fix": "if __name__ == \"__main__\":\n    main()",        "severity": "critical"       }    ],    "CK Metrics": [      {        "identification": "class CKMetricsViolations",        "explanation": "This class violates several CK metrics, notably a high Weighted Methods per Class (WMC) due to its many methods, increasing its complexity.",        "fix": "class CKMetricsViolations: def method1(self): pass def some_few_selected_method(self): pass def some_another_selected_method(self): pass",        "score": 8,        "severity": "major"       },      {        "identification": "class BaseClass",        "explanation": "BaseClass has a high Number of Children (NOC), causing management and potential future changes to be challenging.",        "fix": "class BaseClass: pass class SomeChildClass(BaseClass): pass",        "score": 7,        "severity": "major"       },      {        "identification": "class HighRFCClass",        "explanation": "HighRFCClass demonstrates a high Response for Class (RFC) and low cohesion, increasing its complexity and making it less maintainable.",        "fix": "class HighRFCClass: def method_using_a(self): pass def method_using_d(self): pass",        "score": 7,        "severity": "major"       },      {        "identification": "class Level6",        "explanation": "The depth of inheritance tree in Level6 leads to increased complexity and maintenance difficulties.",        "fix": "class Level6(IndependentBaseClass): pass",        "score": 9,        "severity": "critical"       },      {        "identification": "init method in class CKMetricsViolations",        "explanation": "The __init__ method demonstrates high Coupling Between Objects (CBO), thereby reducing modularity.",        "fix": "class CKMetricsViolations: def __init__(self): self.obj1 = IndependentUtilityClass()",        "score": 8,        "severity": "major"       }    ],    "Cloud Violations": [      {        "identification": "connection = mysql.connector.connect(\n    host=self.db_config['host'],\n    user=self.db_config['user'],\n    password=self.db_config['password'],\n    database=self.db_config['database'],\n    ssl_disabled=True  # SSL disabled\n)",
        "explanation": "SSL is disabled on the Cloud SQL connection. Without SSL, data between the client and server could be intercepted, leading to a significant security risk.",
        "fix": "connection = mysql.connector.connect(\n    host=self.db_config['host'],\n    user=self.db_config['user'],\n    password=self.db_config['password'],\n    database=self.db_config['database'],\n    ssl_disabled=False\n)",
        "score": "10",
        "severity": "critical",
        "violationType": "cloud-sql",
        "policyReference": "cloudSQLNoSSLEnabled"       },
      {
        "identification": "    'protocol': 'HTTP',  # Should be HTTPS\n    'port': 80,\n    'ssl_certificates': None,\n    'redirect_https': False",
        "explanation": "The load balancer is configured to use HTTP instead of HTTPS, allowing insecure traffic through the network, which can lead to data interception.",
        "fix": "    'protocol': 'HTTPS',\n    'port': 443,\n    'ssl_certificates': 'your-ssl-cert',\n    'redirect_https': True",
        "score": "9",
        "severity": "critical",
        "violationType": "load-balancer",
        "policyReference": "httpLoadBalancer"       },
      {
        "identification": "self.api_key = \"sk-1234567890abcdef\"  # Hardcoded API key\nself.password = \"admin123\"  # Hardcoded password",
        "explanation": "Hardcoded secrets within the application code pose a security risk because they can be accessed by unauthorized individuals, leading to data breaches.",
        "fix": "// Store the API key and password in a secure secret manager and access them programmatically\nself.api_key = access_secret('api_key')\nself.password = access_secret('password')",
        "score": "10",
        "severity": "critical",
        "violationType": "secret-management",
        "policyReference": "possibleSecretInComputeMetadata"       },
      {
        "identification": "self.service_account_key = {\n    'key_id': 'old-key-12345',\n    'created_date': '2023-01-01',  # Old key\n    'type': 'service_account'\n}",
        "explanation": "Service account key appears to be old, indicating a lack of regular key rotation. This increases the risk of key compromise over time.",
        "fix": "// Implement automated key rotation and track key usage to ensure keys are rotated within policy timelines\nrotate_service_account_key(self.service_account_key['key_id'])",
        "score": "8",
        "severity": "major",
        "violationType": "service-account",
        "policyReference": "resourceViolationInvalidServiceAccountKey"       },
      {
        "identification": "    'run.googleapis.com/ingress': 'all',  # Should be 'internal'\n    'run.googleapis.com/vpc-access-connector': '',  # Missing VPC\n    'run.googleapis.com/encryption-key': ''  # Missing CMEK",
        "explanation": "Cloud Run configuration allows ingress from all sources, lacks a VPC connector, and does not specify a customer-managed encryption key (CMEK), exposing it to potential unauthorized access.",
        "fix": "    'run.googleapis.com/ingress': 'internal',\n    'run.googleapis.com/vpc-access-connector': 'your-vpc-connector',\n    'run.googleapis.com/encryption-key': 'your-cmek'",
        "score": "10",
        "severity": "critical",
        "violationType": "cloud-run",
        "policyReference": "invalidCloudRunConfig"       }
    ]
  }
}

  return mockresponse;
}
